import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync, renameSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

import type { Requirement, RequirementLabel, RequirementMetadata, RequirementPriority, RequirementStatus } from '../../shared/models/requirement.model';
import { EMOJI_STATUS_MAP, STATUS_EMOJI_MAP, STATUS_TO_COLUMN } from '../../shared/models/requirement.model';

const REQ_FILE_PATH = 'docs/requirements/REQUIREMENTS.md';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);
  private readonly workspaceRoot = join(__dirname, '..', '..', '..', '..', '..');
  private readonly requirementsDir = join(this.workspaceRoot, 'docs', 'requirements');

  public onModuleInit(): void {
    this.logger.log(`Reading requirements from working directory: ${this.workspaceRoot}`);
  }

  private get reqFilePath(): string {
    return join(this.workspaceRoot, REQ_FILE_PATH);
  }

  private get reqDir(): string {
    return this.requirementsDir;
  }

  // --- Read (from working directory) ---

  public getAll(): Requirement[] {
    const content = readFileSync(this.reqFilePath, 'utf-8');
    const parsed = this.parseRequirements(content);

    return parsed.map((req) => {
      // Metadata + attachments: check worktree first, then working tree
      const metadata = this.getMetadata(req.id);
      const attachments = this.detectAttachments(req.id);
      return {
        ...req,
        metadata: metadata ?? {
          priority: req.priority,
          label: req.label,
          tags: [],
          prNumber: null,
          reviewState: null,
          lastUpdated: null
        },
        attachments
      };
    });
  }

  // --- Write ---

  public create(
    title: string,
    description: string,
    priority: RequirementPriority,
    label: RequirementLabel,
    tags: string[]
  ): Requirement {
    const content = readFileSync(this.reqFilePath, 'utf-8');
    const nextId = this.generateNextId(content);
    const emoji = STATUS_EMOJI_MAP['Draft'];
    const newLine = `| ${nextId} | ${title} | ${emoji} Draft | ${priority} | - | ${description} |`;

    const lines = content.split('\n');
    const tableStart = lines.findIndex((l) => l.includes('| REQ-ID') && l.includes('| Name'));
    let insertIdx = tableStart + 2;
    while (insertIdx < lines.length && lines[insertIdx].trim().startsWith('|')) {
      insertIdx++;
    }
    lines.splice(insertIdx, 0, newLine);

    const updated = this.updateStatistics(lines.join('\n'));
    writeFileSync(this.reqFilePath, updated, 'utf-8');
    this.autoCommit(`docs: add ${nextId} ${title}`);

    return {
      id: nextId,
      name: title,
      status: 'Draft',
      priority,
      label,
      dependencies: [],
      description,
      column: 'todo',
      metadata: { priority, label, tags, prNumber: null, reviewState: null, lastUpdated: new Date().toISOString() },
      attachments: []
    };
  }

  public updateStatus(reqId: string, newStatus: RequirementStatus): Requirement | null {
    const content = readFileSync(this.reqFilePath, 'utf-8');
    const emoji = STATUS_EMOJI_MAP[newStatus];
    const lines = content.split('\n');

    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`| ${reqId} `)) {
        const cells = lines[i].split('|').map((c) => c.trim());
        if (cells.length >= 4) {
          cells[3] = `${emoji} ${newStatus}`;
          lines[i] = '| ' + cells.filter((c) => c !== '').join(' | ') + ' |';
          found = true;
        }
        break;
      }
    }

    if (!found) return null;

    const updated = this.updateStatistics(lines.join('\n'));
    writeFileSync(this.reqFilePath, updated, 'utf-8');
    this.autoCommit(`docs: ${reqId} status → ${newStatus}`);

    const all = this.getAll();
    return all.find((r) => r.id === reqId) ?? null;
  }

  private autoCommit(message: string): void {
    try {
      execSync(
        `git -C "${this.workspaceRoot}" add "${REQ_FILE_PATH}" && git -C "${this.workspaceRoot}" commit -m "${message}"`,
        { stdio: 'pipe' }
      );
      this.logger.log(`Committed: ${message}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Commit failed (no changes?): ${msg}`);
    }
  }

  // --- Parsing ---

  private parseRequirements(content: string): Requirement[] {
    const lines = content.split('\n');
    const requirements: Requirement[] = [];
    const tableStart = lines.findIndex((l) => l.includes('| REQ-ID') && l.includes('| Name'));
    if (tableStart === -1) return [];

    for (let i = tableStart + 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('|') || line === '') break;

      const cells = line.split('|').map((c) => c.trim()).filter((c) => c !== '');
      if (cells.length < 6) continue;

      const [id, name, statusCell, priority, deps, description] = cells;
      const status = this.parseStatus(statusCell);
      const parsedDeps = deps === '-' ? [] : deps.split(',').map((d) => d.trim());

      requirements.push({
        id, name, status,
        priority: (priority as RequirementPriority) ?? 'Medium',
        label: 'User Story',
        dependencies: parsedDeps,
        description,
        metadata: null,
        attachments: [],
        column: STATUS_TO_COLUMN[status]
      });
    }
    return requirements;
  }

  private parseStatus(statusCell: string): RequirementStatus {
    for (const [emoji, status] of Object.entries(EMOJI_STATUS_MAP)) {
      if (statusCell.includes(emoji)) return status;
    }
    return 'Draft';
  }

  private generateNextId(content: string): string {
    const reqs = this.parseRequirements(content);
    const maxNum = reqs.reduce((max, r) => {
      const num = parseInt(r.id.replace('REQ-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `REQ-${String(maxNum + 1).padStart(3, '0')}`;
  }

  private updateStatistics(content: string): string {
    const reqs = this.parseRequirements(content);
    const counts: Record<string, number> = {
      'Draft': 0, 'In Review': 0, 'Approved': 0,
      'In Progress': 0, 'Implemented': 0, 'Rejected': 0
    };
    for (const r of reqs) {
      if (r.status in counts) counts[r.status]++;
    }

    const lines = content.split('\n');
    const statsStart = lines.findIndex((l) => l.includes('## Statistics'));
    if (statsStart === -1) return content;

    const statsTableStart = lines.findIndex((l, idx) => idx > statsStart && l.includes('| Status'));
    if (statsTableStart === -1) return content;

    const entries = [
      `| 📝 Draft | ${counts['Draft']} |`,
      `| 🔍 In Review | ${counts['In Review']} |`,
      `| ✅ Approved | ${counts['Approved']} |`,
      `| 🚧 In Progress | ${counts['In Progress']} |`,
      `| ✔️ Implemented | ${counts['Implemented']} |`,
      `| **Total** | **${reqs.length}** |`
    ];

    let replaceStart = statsTableStart + 2;
    let replaceEnd = replaceStart;
    while (replaceEnd < lines.length && lines[replaceEnd].trim().startsWith('|')) replaceEnd++;

    lines.splice(replaceStart, replaceEnd - replaceStart, ...entries);
    return lines.join('\n');
  }

  // --- Metadata ---

  private getMetadata(reqId: string): RequirementMetadata | null {
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (!folder) return null;

    const metaPath = join(folder, 'metadata.json');
    if (!existsSync(metaPath)) return null;

    try {
      return JSON.parse(readFileSync(metaPath, 'utf-8')) as RequirementMetadata;
    } catch { return null; }
  }

  private detectAttachments(reqId: string): string[] {
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (!folder) return [];

    const attachments: string[] = [];
    try {
      const entries = readdirSync(folder);
      for (const name of entries) {
        if (name === 'metadata.json' || name === 'requirement.md') continue;
        const fullPath = join(folder, name);
        if (statSync(fullPath).isDirectory() && name === 'screenshots') {
          const screenshots = readdirSync(fullPath);
          for (const ss of screenshots) attachments.push(`screenshots/${ss}`);
        } else if (statSync(fullPath).isFile()) {
          attachments.push(name);
        }
      }
    } catch { /* folder may not exist */ }

    return attachments;
  }

  public getAttachmentPath(reqId: string, filename: string): string | null {
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (!folder) return null;

    const screenshotPath = join(folder, 'screenshots', filename);
    if (existsSync(screenshotPath)) return screenshotPath;

    const rootPath = join(folder, filename);
    if (existsSync(rootPath)) return rootPath;

    return null;
  }

  public getRequirementContent(reqId: string): string | null {
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (!folder) return null;

    const reqFile = join(folder, 'requirement.md');
    if (!existsSync(reqFile)) return null;

    return readFileSync(reqFile, 'utf-8');
  }

  public saveRequirementContent(reqId: string, content: string): boolean {
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (!folder) return false;

    const reqFile = join(folder, 'requirement.md');
    writeFileSync(reqFile, content, 'utf-8');
    return true;
  }

  public moveUploads(reqId: string, filenames: string[]): void {
    const folder = this.findReqFolderIn(this.requirementsDir, reqId);
    const targetDir = folder
      ? join(folder, 'screenshots')
      : join(this.requirementsDir, reqId, 'screenshots');

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const uploadsDir = join(this.requirementsDir, '.uploads');

    for (const filename of filenames) {
      const src = join(uploadsDir, filename);
      const dest = join(targetDir, filename);
      if (existsSync(src)) {
        renameSync(src, dest);
      }
    }
  }

  private findReqFolderIn(baseDir: string, reqId: string): string | null {
    if (!existsSync(baseDir)) return null;
    try {
      const entries = readdirSync(baseDir);
      const match = entries.find((e) => e.startsWith(reqId));
      return match ? join(baseDir, match) : null;
    } catch {
      return null;
    }
  }
}
