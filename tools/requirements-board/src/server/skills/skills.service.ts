import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

export interface FileItem {
  name: string;
  filename: string;
}

export interface WorkflowItem {
  name: string;
  filename: string;
  section: 'workflow' | 'check' | 'grouped';
}

export interface WorkflowDetail {
  content: string;
  claudeMdContext: string;
}

export interface CreateWorkflowDto {
  name: string;
  content: string;
}

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);
  private readonly workspaceRoot = join(__dirname, '..', '..', '..', '..', '..');
  private readonly skillsDir = join(this.workspaceRoot, '.claude', 'skills');
  private readonly commandsDir = join(this.workspaceRoot, '.claude', 'commands');
  private readonly claudeMdPath = join(this.workspaceRoot, 'CLAUDE.md');

  // --- Path Traversal Guard ---

  private sanitizeFilename(filename: string): string {
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Invalid filename: path traversal detected');
    }
    const sanitized = basename(filename);
    if (!sanitized.endsWith('.md')) {
      throw new BadRequestException('Only .md files are allowed');
    }
    return sanitized;
  }

  // --- Skills ---

  public listSkills(): FileItem[] {
    if (!existsSync(this.skillsDir)) return [];
    return readdirSync(this.skillsDir)
      .filter((f) => f.endsWith('.md'))
      .sort()
      .map((f) => ({
        name: f.replace(/\.md$/, '').replace(/-/g, ' '),
        filename: f,
      }));
  }

  public getSkill(filename: string): { content: string; claudeMdContext: string } {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.skillsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Skill not found: ${safe}`);
    }
    const skillName = safe.replace(/\.md$/, '');
    const claudeMdContext = this.getClaudeMdContextForSkill(skillName);
    return { content: readFileSync(filePath, 'utf-8'), claudeMdContext };
  }

  public saveSkill(filename: string, content: string): { success: boolean } {
    const safe = this.sanitizeFilename(filename);
    if (!existsSync(this.skillsDir)) {
      mkdirSync(this.skillsDir, { recursive: true });
    }
    writeFileSync(join(this.skillsDir, safe), content, 'utf-8');
    this.logger.log(`Saved skill: ${safe}`);
    return { success: true };
  }

  public deleteSkill(filename: string): { success: boolean } {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.skillsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Skill not found: ${safe}`);
    }
    unlinkSync(filePath);
    const skillName = safe.replace(/\.md$/, '');
    this.removeReferencesFromClaudeMd(skillName, 'skill');
    this.logger.log(`Deleted skill: ${safe}`);
    return { success: true };
  }

  // --- Commands ---

  public listCommands(): FileItem[] {
    if (!existsSync(this.commandsDir)) return [];
    return readdirSync(this.commandsDir)
      .filter((f) => f.endsWith('.md'))
      .sort()
      .map((f) => ({
        name: f.replace(/\.md$/, '').replace(/-/g, ' '),
        filename: f,
      }));
  }

  public getCommand(filename: string): { content: string; claudeMdContext: string } {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.commandsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Command not found: ${safe}`);
    }
    const cmdName = safe.replace(/\.md$/, '');
    const claudeMdContext = this.getClaudeMdContextForCommand(cmdName);
    return { content: readFileSync(filePath, 'utf-8'), claudeMdContext };
  }

  public saveCommand(filename: string, content: string): { success: boolean } {
    const safe = this.sanitizeFilename(filename);
    if (!existsSync(this.commandsDir)) {
      mkdirSync(this.commandsDir, { recursive: true });
    }
    writeFileSync(join(this.commandsDir, safe), content, 'utf-8');
    this.logger.log(`Saved command: ${safe}`);
    return { success: true };
  }

  public deleteCommand(filename: string): { success: boolean } {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.commandsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Command not found: ${safe}`);
    }
    unlinkSync(filePath);
    const cmdName = safe.replace(/\.md$/, '');
    this.removeReferencesFromClaudeMd(cmdName, 'command');
    this.logger.log(`Deleted command: ${safe}`);
    return { success: true };
  }

  // --- Workflows (parsed from CLAUDE.md → .claude/commands/) ---

  public listWorkflows(): WorkflowItem[] {
    if (!existsSync(this.claudeMdPath)) return [];
    const content = readFileSync(this.claudeMdPath, 'utf-8');
    return this.parseWorkflowsFromClaudeMd(content);
  }

  public getWorkflow(filename: string): WorkflowDetail {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.commandsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Workflow command not found: ${safe}`);
    }
    const content = readFileSync(filePath, 'utf-8');
    const claudeMdContext = this.getClaudeMdContextForCommand(safe.replace(/\.md$/, ''));
    return { content, claudeMdContext };
  }

  public saveWorkflow(filename: string, content: string): { success: boolean } {
    return this.saveCommand(filename, content);
  }

  public deleteWorkflow(filename: string): { success: boolean } {
    const safe = this.sanitizeFilename(filename);
    const filePath = join(this.commandsDir, safe);
    if (!existsSync(filePath)) {
      throw new BadRequestException(`Workflow not found: ${safe}`);
    }
    unlinkSync(filePath);
    const cmdName = safe.replace(/\.md$/, '');
    this.removeReferencesFromClaudeMd(cmdName, 'command');
    this.logger.log(`Deleted workflow: ${safe}`);
    return { success: true };
  }

  public createWorkflow(name: string, content: string): { success: boolean; filename: string } {
    // Sanitize name to filename
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${slug}.md`;
    const safe = this.sanitizeFilename(filename);

    // Create command file
    if (!existsSync(this.commandsDir)) {
      mkdirSync(this.commandsDir, { recursive: true });
    }
    const filePath = join(this.commandsDir, safe);
    if (existsSync(filePath)) {
      throw new BadRequestException(`Workflow already exists: ${safe}`);
    }
    writeFileSync(filePath, content, 'utf-8');

    // Add reference in CLAUDE.md under "Weitere Commands"
    this.addWorkflowToClaudeMd(slug);

    this.logger.log(`Created workflow: ${safe}`);
    return { success: true, filename: safe };
  }

  // --- Create Skill ---

  public createSkill(name: string, content: string): { success: boolean; filename: string } {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${slug}.md`;
    const safe = this.sanitizeFilename(filename);

    if (!existsSync(this.skillsDir)) {
      mkdirSync(this.skillsDir, { recursive: true });
    }
    const filePath = join(this.skillsDir, safe);
    if (existsSync(filePath)) {
      throw new BadRequestException(`Skill already exists: ${safe}`);
    }
    writeFileSync(filePath, content, 'utf-8');
    this.logger.log(`Created skill: ${safe}`);
    return { success: true, filename: safe };
  }

  // --- Create Command ---

  public createCommand(name: string, content: string): { success: boolean; filename: string } {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${slug}.md`;
    const safe = this.sanitizeFilename(filename);

    if (!existsSync(this.commandsDir)) {
      mkdirSync(this.commandsDir, { recursive: true });
    }
    const filePath = join(this.commandsDir, safe);
    if (existsSync(filePath)) {
      throw new BadRequestException(`Command already exists: ${safe}`);
    }
    writeFileSync(filePath, content, 'utf-8');
    this.logger.log(`Created command: ${safe}`);
    return { success: true, filename: safe };
  }

  // --- LLM Linking Context ---

  /**
   * Returns context needed for LLM to auto-link a new skill/command
   * into existing workflows and CLAUDE.md.
   */
  public getLinkingContext(type: 'skills' | 'commands', filename: string): {
    claudeMd: string;
    workflows: Array<{ name: string; filename: string; content: string }>;
    targetContent: string;
  } {
    // Read CLAUDE.md
    const claudeMd = existsSync(this.claudeMdPath)
      ? readFileSync(this.claudeMdPath, 'utf-8')
      : '';

    // Read target file content
    const dir = type === 'skills' ? this.skillsDir : this.commandsDir;
    const safe = this.sanitizeFilename(filename);
    const targetPath = join(dir, safe);
    const targetContent = existsSync(targetPath)
      ? readFileSync(targetPath, 'utf-8')
      : '';

    // Read all workflow/command files that reference skills
    const workflows: Array<{ name: string; filename: string; content: string }> = [];
    if (existsSync(this.commandsDir)) {
      const files = readdirSync(this.commandsDir).filter((f) => f.endsWith('.md'));
      for (const f of files) {
        const content = readFileSync(join(this.commandsDir, f), 'utf-8');
        // Only include workflows that have skill references or step-based structure
        if (content.includes('.claude/skills/') || content.includes('Step') || content.includes('PFLICHT')) {
          workflows.push({
            name: f.replace(/\.md$/, ''),
            filename: f,
            content,
          });
        }
      }
    }

    return { claudeMd, workflows, targetContent };
  }

  /**
   * Apply LLM-suggested linking changes to CLAUDE.md and workflow files.
   */
  public applyLinking(changes: Array<{ file: string; content: string }>): { applied: number } {
    let applied = 0;
    for (const change of changes) {
      try {
        if (change.file === 'CLAUDE.md') {
          writeFileSync(this.claudeMdPath, change.content, 'utf-8');
          applied++;
        } else if (change.file.endsWith('.md')) {
          const safe = this.sanitizeFilename(change.file);
          const filePath = join(this.commandsDir, safe);
          if (existsSync(filePath)) {
            writeFileSync(filePath, change.content, 'utf-8');
            applied++;
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to apply linking change to ${change.file}: ${err}`);
      }
    }
    return { applied };
  }

  // --- Workflow Helpers ---

  private parseWorkflowsFromClaudeMd(content: string): WorkflowItem[] {
    const workflows: WorkflowItem[] = [];
    const seen = new Set<string>();

    // Find all /command-name references in CLAUDE.md
    const commandRefRegex = /\/([a-z][-a-z0-9]*)/g;
    let match: RegExpExecArray | null;

    while ((match = commandRefRegex.exec(content)) !== null) {
      const name = match[1];
      if (seen.has(name)) continue;

      // Check if a corresponding command file exists
      const filename = `${name}.md`;
      const filePath = join(this.commandsDir, filename);
      if (!existsSync(filePath)) continue;

      seen.add(name);
      const section = this.classifyWorkflow(name);
      workflows.push({
        name,
        filename,
        section,
      });
    }

    // Also add any command files that exist but aren't referenced in CLAUDE.md
    if (existsSync(this.commandsDir)) {
      const files = readdirSync(this.commandsDir).filter((f) => f.endsWith('.md') && f !== 'README.md');
      for (const f of files) {
        const name = f.replace(/\.md$/, '');
        if (seen.has(name)) continue;
        seen.add(name);
        workflows.push({
          name,
          filename: f,
          section: this.classifyWorkflow(name),
        });
      }
    }

    return workflows;
  }

  private classifyWorkflow(name: string): 'workflow' | 'check' | 'grouped' {
    const grouped = ['check-arch', 'check-quality'];
    if (grouped.includes(name)) return 'grouped';
    if (name.startsWith('check-')) return 'check';
    return 'workflow';
  }

  private getClaudeMdContextForSkill(skillName: string): string {
    if (!existsSync(this.claudeMdPath)) return '';
    const content = readFileSync(this.claudeMdPath, 'utf-8');
    const lines = content.split('\n');
    const contextLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(skillName) || line.includes(`.claude/skills/${skillName}`)) {
        const start = Math.max(0, i - 5);
        const end = Math.min(lines.length, i + 10);
        for (let j = start; j < end; j++) {
          if (j > i && /^##\s/.test(lines[j])) break;
          contextLines.push(lines[j]);
        }
        break;
      }
    }

    return contextLines.join('\n');
  }

  private getClaudeMdContextForCommand(commandName: string): string {
    if (!existsSync(this.claudeMdPath)) return '';
    const content = readFileSync(this.claudeMdPath, 'utf-8');
    const lines = content.split('\n');
    const contextLines: string[] = [];
    let capturing = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(`/${commandName}`)) {
        // Capture surrounding context (5 lines before, until next heading or 10 lines after)
        const start = Math.max(0, i - 5);
        const end = Math.min(lines.length, i + 10);
        for (let j = start; j < end; j++) {
          if (j > i && /^##\s/.test(lines[j])) break;
          contextLines.push(lines[j]);
        }
        capturing = true;
        break;
      }
    }

    return capturing ? contextLines.join('\n') : '';
  }

  private addWorkflowToClaudeMd(slug: string): void {
    if (!existsSync(this.claudeMdPath)) return;
    let content = readFileSync(this.claudeMdPath, 'utf-8');

    // Find "Weitere Commands" section and append after the code block
    const marker = '### Weitere Commands';
    const markerIndex = content.indexOf(marker);
    if (markerIndex === -1) {
      // Fallback: append before the "---" after the Workflow section
      this.logger.warn('Could not find "Weitere Commands" section in CLAUDE.md');
      return;
    }

    // Find the closing ``` of the code block after the marker
    const afterMarker = content.substring(markerIndex);
    const codeBlockEnd = afterMarker.indexOf('```\n', afterMarker.indexOf('```') + 3);
    if (codeBlockEnd === -1) return;

    const insertPos = markerIndex + codeBlockEnd;
    const before = content.substring(0, insertPos);
    const after = content.substring(insertPos);

    // Insert the new command reference before the closing ```
    const newLine = `/${slug}${' '.repeat(Math.max(1, 37 - slug.length))}→ Custom Workflow\n`;
    content = before + newLine + after;

    writeFileSync(this.claudeMdPath, content, 'utf-8');
  }

  /**
   * Remove all references to a deleted skill/command from CLAUDE.md.
   * Removes lines containing the reference and cleans up workflows that reference it.
   */
  private removeReferencesFromClaudeMd(name: string, type: 'skill' | 'command'): void {
    if (!existsSync(this.claudeMdPath)) return;
    const content = readFileSync(this.claudeMdPath, 'utf-8');
    const lines = content.split('\n');
    const filtered: string[] = [];

    const patterns = type === 'skill'
      ? [`.claude/skills/${name}`, `skills/${name}.md`, `**${name}**`]
      : [`/${name}`, `.claude/commands/${name}`];

    for (const line of lines) {
      const shouldRemove = patterns.some((p) => line.includes(p))
        && !line.startsWith('#');  // Never remove headings
      if (!shouldRemove) {
        filtered.push(line);
      }
    }

    const updated = filtered.join('\n');
    if (updated !== content) {
      writeFileSync(this.claudeMdPath, updated, 'utf-8');
      this.logger.log(`Removed references to ${type} "${name}" from CLAUDE.md`);
    }

    // Also remove references from workflow command files
    if (type === 'skill' && existsSync(this.commandsDir)) {
      const files = readdirSync(this.commandsDir).filter((f) => f.endsWith('.md'));
      for (const f of files) {
        const filePath = join(this.commandsDir, f);
        const fileContent = readFileSync(filePath, 'utf-8');
        if (fileContent.includes(`.claude/skills/${name}`) || fileContent.includes(`skills/${name}.md`)) {
          const cleanedLines = fileContent.split('\n').filter((l) =>
            !l.includes(`.claude/skills/${name}`) && !l.includes(`skills/${name}.md`)
          );
          writeFileSync(filePath, cleanedLines.join('\n'), 'utf-8');
          this.logger.log(`Removed skill "${name}" reference from command: ${f}`);
        }
      }
    }
  }
}
