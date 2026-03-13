import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync, renameSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

import type { Requirement, RequirementLabel, RequirementMetadata, RequirementPriority, RequirementStatus } from '../../shared/models/requirement.model';
import { EMOJI_STATUS_MAP, STATUS_EMOJI_MAP, STATUS_TO_COLUMN } from '../../shared/models/requirement.model';
import { DatabaseService } from '../database/database.service';

const REQ_FILE_PATH = 'docs/requirements/REQUIREMENTS.md';

interface SyncResult {
  readonly branch: string;
  readonly status: 'synced' | 'conflict-skipped' | 'already-applied' | 'error';
  readonly error?: string;
}

interface SyncStatusResponse {
  readonly commitSha: string;
  readonly mainPushed: boolean;
  readonly branches: SyncResult[];
}

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);
  private readonly workspaceRoot = join(__dirname, '..', '..', '..', '..', '..');
  private readonly requirementsDir = join(this.workspaceRoot, 'docs', 'requirements');

  constructor(private readonly databaseService: DatabaseService) {}

  public onModuleInit(): void {
    this.logger.log(`Reading requirements from working directory: ${this.workspaceRoot}`);
    this.fetchLatestMain();
    this.syncFromMarkdown();
  }

  private get reqFilePath(): string {
    return join(this.workspaceRoot, REQ_FILE_PATH);
  }

  private get reqDir(): string {
    return this.requirementsDir;
  }

  private getCurrentBranch(): string | null {
    try {
      return execSync(`git -C "${this.workspaceRoot}" rev-parse --abbrev-ref HEAD`, { stdio: 'pipe' })
        .toString().trim();
    } catch {
      return null;
    }
  }

  // --- Fetch latest main (for up-to-date board in dailies) ---

  private fetchLatestMain(): void {
    const branch = this.getCurrentBranch();
    try {
      // Always fetch latest main from remote
      execSync(`git -C "${this.workspaceRoot}" fetch origin main --quiet`, { stdio: 'pipe', timeout: 10000 });
      this.logger.log('Fetched latest main from origin');

      // If we ARE on main, pull the changes
      if (branch === 'main') {
        execSync(`git -C "${this.workspaceRoot}" pull origin main --quiet`, { stdio: 'pipe', timeout: 10000 });
        this.logger.log('Pulled latest main');
      } else {
        // On a feature branch: read REQUIREMENTS.md from origin/main into DB
        // so the board always shows main's state
        this.syncFromRemoteMain();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not fetch main (offline?): ${msg}`);
    }
  }

  private syncFromRemoteMain(): void {
    try {
      const content = execSync(
        `git -C "${this.workspaceRoot}" show origin/main:${REQ_FILE_PATH}`,
        { stdio: 'pipe', maxBuffer: 5 * 1024 * 1024 }
      ).toString();

      const parsed = this.parseRequirements(content);
      const count = this.databaseService.importFromMarkdown(parsed);
      this.logger.log(`Synced ${count} requirements from origin/main → SQLite`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not read REQUIREMENTS.md from origin/main: ${msg}`);
    }
  }

  // --- Public sync (called from controller for manual refresh) ---

  public syncFromRemote(): { synced: number; branch: string | null } {
    const branch = this.getCurrentBranch();
    this.fetchLatestMain();
    const reqs = this.databaseService.getAll();
    return { synced: reqs.length, branch };
  }

  // --- Sync: Markdown → DB on startup ---

  private syncFromMarkdown(): void {
    if (!existsSync(this.reqFilePath)) {
      this.logger.warn('REQUIREMENTS.md not found, skipping sync');
      return;
    }

    const content = readFileSync(this.reqFilePath, 'utf-8');
    const parsed = this.parseRequirements(content);
    const enriched = parsed.map((req) => {
      const metadata = this.getMetadata(req.id);
      return { ...req, metadata: metadata ?? req.metadata };
    });

    const count = this.databaseService.importFromMarkdown(enriched);
    this.logger.log(`Synced ${count} requirements from REQUIREMENTS.md → SQLite`);
  }

  // --- Sync: DB → Markdown (write back after changes) ---

  private syncToMarkdown(): void {
    if (!existsSync(this.reqFilePath)) return;

    const dbReqs = this.databaseService.getAll();
    const content = readFileSync(this.reqFilePath, 'utf-8');
    const lines = content.split('\n');

    const tableStart = lines.findIndex((l) => l.includes('| REQ-ID') && l.includes('| Name'));
    if (tableStart === -1) return;

    // Remove old table rows
    let rowStart = tableStart + 2;
    let rowEnd = rowStart;
    while (rowEnd < lines.length && lines[rowEnd].trim().startsWith('|') && lines[rowEnd].trim() !== '') {
      rowEnd++;
    }

    // Build new rows from DB
    const newRows = dbReqs.map((req) => {
      const emoji = STATUS_EMOJI_MAP[req.status];
      const deps = req.dependencies.length > 0 ? req.dependencies.join(', ') : '-';
      return `| ${req.id} | ${req.name} | ${emoji} ${req.status} | ${req.priority} | ${deps} | ${req.description} |`;
    });

    lines.splice(rowStart, rowEnd - rowStart, ...newRows);
    const updated = this.updateStatistics(lines.join('\n'));
    writeFileSync(this.reqFilePath, updated, 'utf-8');
  }

  // --- Read (DB primary, enriched with file-based attachments) ---

  public getAll(): Requirement[] {
    const dbReqs = this.databaseService.getAll();

    return dbReqs.map((req) => {
      const attachments = this.detectAttachments(req.id);
      return { ...req, attachments };
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
    const nextId = this.databaseService.getNextId();
    const branch = this.getCurrentBranch();

    const req = this.databaseService.create({
      id: nextId,
      name: title,
      description,
      priority,
      label,
      tags,
      branch: branch ?? undefined
    });

    // Sync back to markdown
    this.syncToMarkdown();
    this.autoCommit(`docs: add ${nextId} ${title}`);

    return req;
  }

  public delete(reqId: string): boolean {
    const deleted = this.databaseService.delete(reqId);
    if (!deleted) return false;

    // Remove requirement folder if it exists
    const folder = this.findReqFolderIn(this.reqDir, reqId);
    if (folder && existsSync(folder)) {
      rmSync(folder, { recursive: true, force: true });
    }

    // Sync back to markdown and commit
    this.syncToMarkdown();
    this.autoCommit(`docs: delete ${reqId}`);

    return true;
  }

  public updateStatus(reqId: string, newStatus: RequirementStatus): Requirement | null {
    const branch = this.getCurrentBranch();
    const updated = this.databaseService.updateStatus(reqId, newStatus, branch ?? undefined);

    if (!updated) return null;

    // Sync status to main and cherry-pick to all req/feat branches
    const syncResult = this.syncStatusAcrossBranches(reqId, newStatus);
    this.logger.log(`Synced ${reqId} to ${syncResult.branches.length} branches`);

    // Auto-create feature branch when moving to "In Progress"
    if (newStatus === 'In Progress') {
      this.createFeatureBranch(reqId, updated.name);
    }

    const attachments = this.detectAttachments(reqId);
    return { ...updated, attachments };
  }

  /**
   * Creates a feature branch feat/REQ-XXX-Name when moving to In Progress.
   * Silently skips if branch already exists.
   */
  private createFeatureBranch(reqId: string, name: string): void {
    const slug = `${reqId}-${name}`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const branchName = `feat/${slug}`;
    try {
      // Check if branch already exists
      const existing = execSync(
        `git -C "${this.workspaceRoot}" branch --list "${branchName}"`,
        { stdio: 'pipe' }
      ).toString().trim();

      if (existing) {
        // Branch exists, just checkout
        execSync(`git -C "${this.workspaceRoot}" checkout "${branchName}"`, { stdio: 'pipe' });
        this.logger.log(`Checked out existing branch: ${branchName}`);
      } else {
        // Create and checkout new branch
        execSync(`git -C "${this.workspaceRoot}" checkout -b "${branchName}"`, { stdio: 'pipe' });
        this.logger.log(`Created feature branch: ${branchName}`);
      }

      // Update the requirement's branch in DB
      this.databaseService.updateBranch(reqId, branchName);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to create feature branch ${branchName}: ${msg}`);
    }
  }

  // --- Cross-branch status sync ---

  public syncStatusAcrossBranches(reqId: string, newStatus: RequirementStatus): SyncStatusResponse {
    const originalBranch = this.getCurrentBranch();

    // If on detached HEAD, fallback to old behavior
    if (!originalBranch || originalBranch === 'HEAD') {
      this.syncToMarkdown();
      this.autoCommit(`docs: ${reqId} status → ${newStatus}`);
      return { commitSha: '', mainPushed: false, branches: [] };
    }

    const stashMsg = `board-sync-${Date.now()}`;
    const stashed = this.stashLocalChanges(stashMsg);

    try {
      const commitSha = this.commitOnMain(reqId, newStatus);
      if (!commitSha) {
        // Main commit failed, fallback
        this.gitCheckout(originalBranch);
        if (stashed) this.unstashLocalChanges(stashMsg);
        this.syncToMarkdown();
        this.autoCommit(`docs: ${reqId} status → ${newStatus}`);
        return { commitSha: '', mainPushed: false, branches: [] };
      }

      const branches = this.getReqFeatBranches();
      const results = branches
        .filter(b => b !== 'main')
        .map(b => this.cherryPickToBranch(b, commitSha, reqId, newStatus));

      return { commitSha, mainPushed: true, branches: results };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Sync failed: ${msg}`);
      return { commitSha: '', mainPushed: false, branches: [] };
    } finally {
      this.gitCheckout(originalBranch);
      if (stashed) this.unstashLocalChanges(stashMsg);
    }
  }

  private stashLocalChanges(stashMsg: string): boolean {
    try {
      const countBefore = this.getStashCount();
      execSync(
        `git -C "${this.workspaceRoot}" stash push -m "${stashMsg}" --include-untracked`,
        { stdio: 'pipe' }
      );
      const countAfter = this.getStashCount();
      return countAfter > countBefore;
    } catch {
      return false;
    }
  }

  private unstashLocalChanges(stashMsg: string): void {
    try {
      const topStash = execSync(
        `git -C "${this.workspaceRoot}" stash list -1`,
        { stdio: 'pipe' }
      ).toString().trim();

      if (topStash.includes(stashMsg)) {
        execSync(`git -C "${this.workspaceRoot}" stash pop`, { stdio: 'pipe' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to unstash: ${msg}`);
    }
  }

  private getStashCount(): number {
    try {
      const list = execSync(
        `git -C "${this.workspaceRoot}" stash list`,
        { stdio: 'pipe' }
      ).toString().trim();
      return list === '' ? 0 : list.split('\n').length;
    } catch {
      return 0;
    }
  }

  private getReqFeatBranches(): string[] {
    try {
      execSync(`git -C "${this.workspaceRoot}" fetch --all --prune`, { stdio: 'pipe', timeout: 15000 });
    } catch {
      this.logger.warn('fetch --all failed (offline?)');
    }

    const branches = new Set<string>();

    try {
      const local = execSync(
        `git -C "${this.workspaceRoot}" branch --list "req/*" "feat/*"`,
        { stdio: 'pipe' }
      ).toString().trim();

      for (const line of local.split('\n')) {
        const name = line.replace(/^\*?\s+/, '').trim();
        if (name) branches.add(name);
      }
    } catch { /* no local branches */ }

    try {
      const remote = execSync(
        `git -C "${this.workspaceRoot}" branch -r --list "origin/req/*" "origin/feat/*"`,
        { stdio: 'pipe' }
      ).toString().trim();

      for (const line of remote.split('\n')) {
        const name = line.trim().replace(/^origin\//, '');
        if (name && !name.includes('HEAD')) branches.add(name);
      }
    } catch { /* no remote branches */ }

    return Array.from(branches);
  }

  private commitOnMain(reqId: string, newStatus: RequirementStatus): string | null {
    try {
      this.gitCheckout('main');
      execSync(`git -C "${this.workspaceRoot}" pull origin main --rebase`, { stdio: 'pipe', timeout: 15000 });

      this.syncToMarkdown();

      execSync(`git -C "${this.workspaceRoot}" add "${REQ_FILE_PATH}"`, { stdio: 'pipe' });

      // Check if there are actual changes to commit
      try {
        execSync(`git -C "${this.workspaceRoot}" diff --cached --quiet`, { stdio: 'pipe' });
        // No changes — already up to date
        return execSync(`git -C "${this.workspaceRoot}" rev-parse HEAD`, { stdio: 'pipe' }).toString().trim();
      } catch {
        // diff --cached --quiet exits 1 when there ARE changes — proceed with commit
      }

      const commitMsg = `docs(board-sync): ${reqId} status → ${newStatus}`;
      execSync(
        `git -C "${this.workspaceRoot}" commit -m "${commitMsg}"`,
        { stdio: 'pipe' }
      );

      execSync(`git -C "${this.workspaceRoot}" push origin main`, { stdio: 'pipe', timeout: 15000 });
      this.logger.log(`Committed and pushed to main: ${commitMsg}`);

      return execSync(`git -C "${this.workspaceRoot}" rev-parse HEAD`, { stdio: 'pipe' }).toString().trim();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to commit on main: ${msg}`);
      return null;
    }
  }

  private cherryPickToBranch(branch: string, commitSha: string, reqId: string, newStatus: RequirementStatus): SyncResult {
    try {
      // Try checking out existing local branch, else create from remote
      try {
        execSync(`git -C "${this.workspaceRoot}" checkout "${branch}"`, { stdio: 'pipe' });
      } catch {
        try {
          execSync(`git -C "${this.workspaceRoot}" checkout -b "${branch}" "origin/${branch}"`, { stdio: 'pipe' });
        } catch {
          return { branch, status: 'error', error: `Could not checkout ${branch}` };
        }
      }

      // Cherry-pick with --no-commit to inspect result
      try {
        execSync(`git -C "${this.workspaceRoot}" cherry-pick ${commitSha} --no-commit`, { stdio: 'pipe' });
      } catch {
        // Conflict — abort and skip
        try {
          execSync(`git -C "${this.workspaceRoot}" cherry-pick --abort`, { stdio: 'pipe' });
        } catch { /* already clean */ }
        return { branch, status: 'conflict-skipped' };
      }

      // Check if cherry-pick produced any staged changes
      try {
        execSync(`git -C "${this.workspaceRoot}" diff --cached --quiet`, { stdio: 'pipe' });
        // No changes — already applied
        execSync(`git -C "${this.workspaceRoot}" reset`, { stdio: 'pipe' });
        return { branch, status: 'already-applied' };
      } catch {
        // There are changes — commit them
      }

      const commitMsg = `docs(board-sync): ${reqId} status → ${newStatus}`;
      execSync(`git -C "${this.workspaceRoot}" commit -m "${commitMsg}"`, { stdio: 'pipe' });

      try {
        execSync(`git -C "${this.workspaceRoot}" push origin "${branch}"`, { stdio: 'pipe', timeout: 15000 });
      } catch (pushErr: unknown) {
        const pushMsg = pushErr instanceof Error ? pushErr.message : String(pushErr);
        this.logger.warn(`Push failed for ${branch}: ${pushMsg}`);
        // Commit is local, next sync will retry
      }

      return { branch, status: 'synced' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { branch, status: 'error', error: errMsg };
    }
  }

  private gitCheckout(branch: string): void {
    try {
      execSync(`git -C "${this.workspaceRoot}" checkout "${branch}"`, { stdio: 'pipe' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to checkout ${branch}: ${msg}`);
    }
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

  // --- Parsing (for markdown import) ---

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

  // --- History API (new, powered by SQLite) ---

  public getHistory(reqId: string): Array<{
    field: string;
    oldValue: string | null;
    newValue: string | null;
    branch: string | null;
    changedAt: string;
  }> {
    return this.databaseService.getHistory(reqId);
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
