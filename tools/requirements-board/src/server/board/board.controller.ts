import { Body, Controller, Get, Param, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync, existsSync, createReadStream } from 'fs';
import { join, resolve, extname } from 'path';
import type { Response } from 'express';

import type { Requirement, RequirementLabel, RequirementPriority, RequirementStatus } from '../../shared/models/requirement.model';
import { BoardService } from './board.service';

interface CreateRequirementDto {
  readonly title: string;
  readonly description: string;
  readonly priority: RequirementPriority;
  readonly label: RequirementLabel;
  readonly tags: string[] | string;
}

interface UpdateStatusDto {
  readonly status: RequirementStatus;
}

@Controller('requirements')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  public getRequirements(): Requirement[] {
    return this.boardService.getAll();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const tmpDir = join(__dirname, '..', '..', '..', '..', '..', 'docs', 'requirements', '.uploads');
        if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });
        cb(null, tmpDir);
      },
      filename: (_req, file, cb) => {
        cb(null, file.originalname);
      }
    }),
    fileFilter: (_req, file, cb) => {
      const allowed = /\.(jpg|jpeg|png|gif|webp|svg|pdf|html)$/i;
      cb(null, allowed.test(file.originalname));
    },
    limits: { fileSize: 10 * 1024 * 1024 }
  }))
  public createRequirement(
    @Body() dto: CreateRequirementDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Requirement {
    const tags = typeof dto.tags === 'string'
      ? (dto.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : (dto.tags ?? []);

    const req = this.boardService.create(dto.title, dto.description, dto.priority, dto.label, tags);

    if (files && files.length > 0) {
      this.boardService.moveUploads(req.id, files.map(f => f.filename));
    }

    return req;
  }

  @Put(':id/status')
  public updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto
  ): Requirement | null {
    return this.boardService.updateStatus(id, dto.status);
  }

  @Get(':id/content')
  public getContent(@Param('id') id: string): { content: string } | { error: string } {
    const content = this.boardService.getRequirementContent(id);
    if (content === null) return { error: 'requirement.md not found' };
    return { content };
  }

  @Put(':id/content')
  public saveContent(
    @Param('id') id: string,
    @Body() dto: { content: string }
  ): { success: boolean } {
    return { success: this.boardService.saveRequirementContent(id, dto.content) };
  }

  @Get(':id/attachments/:filename')
  public getAttachment(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Res() res: Response
  ): void {
    const filePath = this.boardService.getAttachmentPath(id, filename);
    if (filePath && existsSync(filePath)) {
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf'
      };
      const ext = extname(filename).toLowerCase();
      const contentType = mimeTypes[ext] ?? 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      createReadStream(resolve(filePath)).pipe(res);
    } else {
      res.status(404).json({ message: 'Attachment not found' });
    }
  }
}
