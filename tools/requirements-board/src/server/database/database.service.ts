import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import type {
  KanbanColumn,
  Requirement,
  RequirementLabel,
  RequirementMetadata,
  RequirementPriority,
  RequirementStatus
} from '../../shared/models/requirement.model';
import { STATUS_TO_COLUMN } from '../../shared/models/requirement.model';

interface RequirementRow {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly priority: string;
  readonly label: string;
  readonly dependencies: string;
  readonly description: string;
  readonly column_name: string;
  readonly tags: string;
  readonly pr_number: number | null;
  readonly review_state: string | null;
  readonly branch: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private db!: DatabaseType;
  private readonly dbPath: string;

  constructor() {
    const toolRoot = join(__dirname, '..', '..', '..');
    const dataDir = join(toolRoot, 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = join(dataDir, 'board.db');
    this.initDatabase();
  }

  public onModuleDestroy(): void {
    if (this.db) {
      this.db.close();
      this.logger.log('Database closed');
    }
  }

  private initDatabase(): void {
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS requirements (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        status        TEXT NOT NULL DEFAULT 'Draft',
        priority      TEXT NOT NULL DEFAULT 'Medium',
        label         TEXT NOT NULL DEFAULT 'User Story',
        dependencies  TEXT NOT NULL DEFAULT '[]',
        description   TEXT NOT NULL DEFAULT '',
        column_name   TEXT NOT NULL DEFAULT 'todo',
        tags          TEXT NOT NULL DEFAULT '[]',
        pr_number     INTEGER,
        review_state  TEXT,
        branch        TEXT,
        created_at    TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS history (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        req_id        TEXT NOT NULL,
        field         TEXT NOT NULL,
        old_value     TEXT,
        new_value     TEXT,
        branch        TEXT,
        changed_at    TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (req_id) REFERENCES requirements(id)
      );

      CREATE INDEX IF NOT EXISTS idx_history_req ON history(req_id);
      CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
      CREATE INDEX IF NOT EXISTS idx_requirements_branch ON requirements(branch);
    `);

    this.logger.log(`Database initialized at ${this.dbPath}`);
  }

  // --- CRUD ---

  public getAll(): Requirement[] {
    const rows = this.db.prepare('SELECT * FROM requirements ORDER BY id').all() as RequirementRow[];
    return rows.map((row) => this.rowToRequirement(row));
  }

  public getById(id: string): Requirement | null {
    const row = this.db.prepare('SELECT * FROM requirements WHERE id = ?').get(id) as RequirementRow | undefined;
    return row ? this.rowToRequirement(row) : null;
  }

  public create(req: {
    id: string;
    name: string;
    description: string;
    priority: RequirementPriority;
    label: RequirementLabel;
    tags: string[];
    branch?: string;
  }): Requirement {
    const column = STATUS_TO_COLUMN['Draft'];

    this.db.prepare(`
      INSERT INTO requirements (id, name, status, priority, label, dependencies, description, column_name, tags, branch, created_at, updated_at)
      VALUES (?, ?, 'Draft', ?, ?, '[]', ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      req.id, req.name, req.priority, req.label,
      req.description, column, JSON.stringify(req.tags),
      req.branch ?? null
    );

    this.addHistory(req.id, 'status', null, 'Draft', req.branch ?? null);

    return this.getById(req.id)!;
  }

  public updateStatus(id: string, newStatus: RequirementStatus, branch?: string): Requirement | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const newColumn = STATUS_TO_COLUMN[newStatus];
    const oldStatus = existing.status;

    this.db.prepare(`
      UPDATE requirements SET status = ?, column_name = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newStatus, newColumn, id);

    if (branch) {
      this.db.prepare('UPDATE requirements SET branch = ? WHERE id = ?').run(branch, id);
    }

    this.addHistory(id, 'status', oldStatus, newStatus, branch ?? null);

    return this.getById(id);
  }

  public delete(id: string): boolean {
    const existing = this.getById(id);
    if (!existing) return false;

    this.db.prepare('DELETE FROM history WHERE req_id = ?').run(id);
    this.db.prepare('DELETE FROM requirements WHERE id = ?').run(id);
    return true;
  }

  public updateBranch(id: string, branch: string): boolean {
    const existing = this.getById(id);
    if (!existing) return false;

    this.db.prepare('UPDATE requirements SET branch = ?, updated_at = datetime(\'now\') WHERE id = ?').run(branch, id);
    this.addHistory(id, 'branch', null, branch, branch);
    return true;
  }

  public updateField(id: string, field: string, value: string, branch?: string): boolean {
    const allowedFields = ['name', 'description', 'priority', 'label', 'tags', 'pr_number', 'review_state', 'branch'];
    if (!allowedFields.includes(field)) return false;

    const existing = this.getById(id);
    if (!existing) return false;

    this.db.prepare(`
      UPDATE requirements SET ${field} = ?, updated_at = datetime('now') WHERE id = ?
    `).run(value, id);

    this.addHistory(id, field, null, value, branch ?? null);
    return true;
  }

  // --- Import from parsed REQUIREMENTS.md data ---

  public importFromMarkdown(requirements: Requirement[]): number {
    let imported = 0;

    const upsert = this.db.prepare(`
      INSERT INTO requirements (id, name, status, priority, label, dependencies, description, column_name, tags, pr_number, review_state, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        status = excluded.status,
        priority = excluded.priority,
        label = excluded.label,
        dependencies = excluded.dependencies,
        description = excluded.description,
        column_name = excluded.column_name,
        tags = excluded.tags,
        pr_number = excluded.pr_number,
        review_state = excluded.review_state,
        updated_at = datetime('now')
    `);

    const insertMany = this.db.transaction((reqs: Requirement[]) => {
      for (const req of reqs) {
        const meta = req.metadata;
        upsert.run(
          req.id, req.name, req.status, req.priority, req.label,
          JSON.stringify(req.dependencies),
          req.description,
          req.column,
          JSON.stringify(meta?.tags ?? []),
          meta?.prNumber ?? null,
          meta?.reviewState ?? null
        );
        imported++;
      }
    });

    insertMany(requirements);
    this.logger.log(`Imported/synced ${imported} requirements into SQLite`);
    return imported;
  }

  // --- Query helpers ---

  public getNextId(): string {
    const row = this.db.prepare(
      "SELECT id FROM requirements ORDER BY CAST(REPLACE(id, 'REQ-', '') AS INTEGER) DESC LIMIT 1"
    ).get() as { id: string } | undefined;

    if (!row) return 'REQ-001';

    const num = parseInt(row.id.replace('REQ-', ''), 10);
    return `REQ-${String(num + 1).padStart(3, '0')}`;
  }

  public getHistory(reqId: string): Array<{
    field: string;
    oldValue: string | null;
    newValue: string | null;
    branch: string | null;
    changedAt: string;
  }> {
    const rows = this.db.prepare(
      'SELECT field, old_value, new_value, branch, changed_at FROM history WHERE req_id = ? ORDER BY changed_at DESC'
    ).all(reqId) as Array<{
      field: string;
      old_value: string | null;
      new_value: string | null;
      branch: string | null;
      changed_at: string;
    }>;

    return rows.map((r) => ({
      field: r.field,
      oldValue: r.old_value,
      newValue: r.new_value,
      branch: r.branch,
      changedAt: r.changed_at
    }));
  }

  public count(): number {
    const row = this.db.prepare('SELECT COUNT(*) as cnt FROM requirements').get() as { cnt: number };
    return row.cnt;
  }

  // --- Private helpers ---

  private addHistory(reqId: string, field: string, oldValue: string | null, newValue: string | null, branch: string | null): void {
    this.db.prepare(
      'INSERT INTO history (req_id, field, old_value, new_value, branch) VALUES (?, ?, ?, ?, ?)'
    ).run(reqId, field, oldValue, newValue, branch);
  }

  private rowToRequirement(row: RequirementRow): Requirement {
    let deps: string[] = [];
    try { deps = JSON.parse(row.dependencies); } catch { deps = []; }

    let tags: string[] = [];
    try { tags = JSON.parse(row.tags); } catch { tags = []; }

    const metadata: RequirementMetadata = {
      priority: row.priority as RequirementPriority,
      label: row.label as RequirementLabel,
      tags,
      prNumber: row.pr_number,
      reviewState: row.review_state,
      lastUpdated: row.updated_at
    };

    return {
      id: row.id,
      name: row.name,
      status: row.status as RequirementStatus,
      priority: row.priority as RequirementPriority,
      label: row.label as RequirementLabel,
      dependencies: deps,
      description: row.description,
      metadata,
      attachments: [],
      column: row.column_name as KanbanColumn
    };
  }
}
