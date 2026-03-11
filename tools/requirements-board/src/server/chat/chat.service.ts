import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly workspaceRoot = join(__dirname, '..', '..', '..', '..', '..');

  public async chat(
    reqId: string,
    userMessage: string,
    requirementContent: string,
    onChunk: (text: string) => void
  ): Promise<void> {
    const reqFolder = this.findReqFolder(reqId);
    const reqFilePath = reqFolder ? join(reqFolder, 'requirement.md') : null;

    const systemPrompt = [
      'Du bist ein Requirements-Assistent für ein Angular-Projekt.',
      'Der Benutzer bearbeitet gerade ein Requirement-Dokument.',
      'Antworte kurz und präzise auf Deutsch.',
      '',
      'Wenn der Benutzer eine Änderung am Requirement wünscht, gib den geänderten Abschnitt als Markdown zurück.',
      'Markiere Änderungen mit einem Code-Block: ```markdown ... ```',
      '',
      `Requirement ID: ${reqId}`,
      reqFilePath ? `Datei: ${reqFilePath}` : '',
      '',
      '--- Aktueller Requirement-Inhalt ---',
      requirementContent || '(kein Inhalt)',
      '--- Ende ---'
    ].join('\n');

    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;

    return new Promise<void>((resolve) => {
      const cleanEnv = { ...process.env };
      delete cleanEnv['CLAUDECODE'];

      const child = spawn('claude', [
        '--print',
        '--output-format', 'text',
        fullPrompt
      ], {
        cwd: this.workspaceRoot,
        env: cleanEnv,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      child.stdout.on('data', (data: Buffer) => {
        onChunk(data.toString());
      });

      child.stderr.on('data', (data: Buffer) => {
        this.logger.warn(`Chat stderr: ${data.toString()}`);
      });

      child.on('close', () => resolve());
      child.on('error', (err: Error) => {
        this.logger.error(`Chat error: ${err.message}`);
        onChunk(`Fehler: ${err.message}`);
        resolve();
      });
    });
  }

  private findReqFolder(reqId: string): string | null {
    const reqDir = join(this.workspaceRoot, 'docs', 'requirements');
    if (!existsSync(reqDir)) return null;
    try {
      const entries = readdirSync(reqDir);
      const match = entries.find((e) => e.startsWith(reqId));
      return match ? join(reqDir, match) : null;
    } catch {
      return null;
    }
  }
}
