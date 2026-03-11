import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';

export interface WorkflowResult {
  readonly success: boolean;
  readonly message: string;
}

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);
  private readonly workspaceRoot = join(__dirname, '..', '..', '..', '..', '..');

  public async trigger(
    workflow: 'create' | 'implement' | 'update',
    requirementId: string
  ): Promise<WorkflowResult> {
    const scriptMap: Record<string, string> = {
      create: 'scripts/create-requirement.sh',
      implement: 'scripts/implement-requirement.sh',
      update: 'scripts/update-requirement.sh'
    };

    const scriptPath = join(this.workspaceRoot, scriptMap[workflow]);
    const command = `bash "${scriptPath}" ${requirementId}`;

    return new Promise<WorkflowResult>((resolve) => {
      const { exec } = require('child_process');
      exec(command, { cwd: this.workspaceRoot, timeout: 120000 }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          resolve({ success: false, message: stderr || error.message });
        } else {
          resolve({ success: true, message: stdout || 'Workflow completed.' });
        }
      });
    });
  }

  /**
   * Stream workflow output line-by-line via a callback.
   * For 'implement': uses full Claude Code with all tools.
   * For 'create'/'update': uses shell scripts.
   */
  public triggerStreaming(
    workflow: 'create' | 'implement' | 'update',
    requirementId: string,
    onLine: (line: string) => void
  ): Promise<WorkflowResult> {
    if (workflow === 'implement') {
      return this.runImplementWithClaudeCode(requirementId, onLine);
    }

    const scriptMap: Record<string, string> = {
      create: 'scripts/create-requirement.sh',
      update: 'scripts/update-requirement.sh'
    };

    const scriptPath = join(this.workspaceRoot, scriptMap[workflow]);

    return new Promise<WorkflowResult>((resolve) => {
      const child = spawn('bash', [scriptPath, requirementId], {
        cwd: this.workspaceRoot,
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        text.split('\n').filter((l: string) => l.trim()).forEach((line: string) => onLine(line));
      });

      child.stderr.on('data', (data: Buffer) => {
        const text = data.toString();
        stderr += text;
        text.split('\n').filter((l: string) => l.trim()).forEach((line: string) => onLine(`[stderr] ${line}`));
      });

      child.on('close', (code: number | null) => {
        if (code === 0) {
          resolve({ success: true, message: stdout || 'Workflow completed.' });
        } else {
          resolve({ success: false, message: stderr || `Process exited with code ${code}` });
        }
      });

      child.on('error', (err: Error) => {
        resolve({ success: false, message: err.message });
      });
    });
  }

  /**
   * Generate an implementation plan using Claude CLI.
   * Streams the plan output line-by-line.
   */
  public generatePlan(
    requirementId: string,
    onChunk: (text: string) => void
  ): Promise<WorkflowResult> {
    const reqContent = this.readRequirement(requirementId);

    const prompt = [
      `Erstelle einen Implementierungsplan für das Requirement ${requirementId}.`,
      '',
      'WICHTIG:',
      '- Lies die relevanten Dateien im Projekt SELBST (Store, Routes, Models, i18n, Guards, Components).',
      '- Prüfe was BEREITS implementiert ist. Schlage NUR vor was TATSÄCHLICH fehlt.',
      '- Lies docs/requirements/REQUIREMENTS.md für den Status aller Requirements.',
      '- Lies den booking.store.ts, booking.routes.ts und die Models.',
      '',
      'Gib einen strukturierten Plan mit folgenden Abschnitten:',
      '1. **Übersicht** — Was wird implementiert (1-2 Sätze)',
      '2. **Bereits vorhanden** — Was existiert schon im Code (Store-Properties, Models, Routes, Components)',
      '3. **Neue Dateien** — NUR Dateien die wirklich NEU erstellt werden müssen (Pfad + Zweck)',
      '4. **Geänderte Dateien** — Bestehende Dateien die angepasst werden (was genau)',
      '5. **Store-Änderungen** — Nur NEUE State-Properties, Computed, Methods',
      '6. **Routing** — Neue Routes / Guards / Resolver',
      '7. **i18n Keys** — Neue Übersetzungskeys (DE + EN)',
      '8. **Tests** — Welche Tests werden geschrieben',
      '9. **Implementierungsschritte** — Reihenfolge',
      '',
      '--- Requirement-Inhalt ---',
      reqContent || '(kein requirement.md gefunden)',
      '--- Ende Requirement ---',
    ].join('\n');

    const cleanEnv = { ...process.env };
    delete cleanEnv['CLAUDECODE'];

    return new Promise<WorkflowResult>((resolve) => {
      const child = spawn('claude', [
        '--verbose',
        '--output-format', 'text',
        '--allowedTools', 'Read,Glob,Grep,Bash(read-only)',
        '-p',
        prompt
      ], {
        cwd: this.workspaceRoot,
        env: cleanEnv,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';

      child.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        onChunk(text);
      });

      child.stderr.on('data', (data: Buffer) => {
        this.logger.warn(`Plan stderr: ${data.toString()}`);
      });

      child.on('close', (code: number | null) => {
        resolve({
          success: code === 0,
          message: stdout || 'Plan generation completed.'
        });
      });

      child.on('error', (err: Error) => {
        onChunk(`Fehler: ${err.message}`);
        resolve({ success: false, message: err.message });
      });
    });
  }

  /**
   * Run full Claude Code with all tools for implementation.
   * Uses /implement-requirement command.
   */
  private runImplementWithClaudeCode(
    requirementId: string,
    onLine: (line: string) => void
  ): Promise<WorkflowResult> {
    const cleanEnv = { ...process.env };
    delete cleanEnv['CLAUDECODE'];

    const prompt = `/implement-requirement ${requirementId}`;

    return new Promise<WorkflowResult>((resolve) => {
      const child = spawn('claude', [
        '--verbose',
        '--output-format', 'text',
        '-p',
        prompt
      ], {
        cwd: this.workspaceRoot,
        env: cleanEnv,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        text.split('\n').filter((l: string) => l.trim()).forEach((line: string) => onLine(line));
      });

      child.stderr.on('data', (data: Buffer) => {
        const text = data.toString();
        stderr += text;
        text.split('\n').filter((l: string) => l.trim()).forEach((line: string) => onLine(`[claude] ${line}`));
      });

      child.on('close', (code: number | null) => {
        if (code === 0) {
          resolve({ success: true, message: stdout || 'Implementation completed.' });
        } else {
          resolve({ success: false, message: stderr || `Claude Code exited with code ${code}` });
        }
      });

      child.on('error', (err: Error) => {
        onLine(`ERROR: ${err.message}`);
        resolve({ success: false, message: err.message });
      });
    });
  }

  private readRequirement(requirementId: string): string | null {
    const reqDir = join(this.workspaceRoot, 'docs', 'requirements');
    if (!existsSync(reqDir)) return null;

    try {
      const entries = readdirSync(reqDir);
      const reqNum = requirementId.match(/REQ-\d+/)?.[0];
      const folder = entries.find((e) => reqNum && e.startsWith(reqNum));
      if (!folder) return null;

      const reqFile = join(reqDir, folder, 'requirement.md');
      if (!existsSync(reqFile)) return null;

      return readFileSync(reqFile, 'utf-8');
    } catch {
      return null;
    }
  }
}
