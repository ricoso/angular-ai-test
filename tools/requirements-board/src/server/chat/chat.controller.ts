import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { ChatService } from './chat.service';

interface ChatMessageDto {
  readonly reqId: string;
  readonly message: string;
  readonly requirementContent: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * POST /api/chat
   * Streams Claude response as SSE events.
   */
  @Post()
  public async chat(
    @Body() dto: ChatMessageDto,
    @Res() res: Response
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    await this.chatService.chat(
      dto.reqId,
      dto.message,
      dto.requirementContent,
      (chunk: string) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  }
}
