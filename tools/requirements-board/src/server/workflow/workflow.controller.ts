import { Controller, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * POST /api/workflow/plan/:reqId
   * Generates an implementation plan via Claude, streamed as SSE.
   */
  @Post('plan/:reqId')
  public async generatePlan(
    @Param('reqId') reqId: string,
    @Res() res: Response
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const result = await this.workflowService.generatePlan(
      reqId,
      (chunk: string) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ type: 'done', success: result.success })}\n\n`);
    res.end();
  }

  /**
   * POST /api/workflow/:type/:reqId
   * Runs a workflow script, streamed as SSE.
   */
  @Post(':type/:reqId')
  public async triggerStream(
    @Param('type') type: string,
    @Param('reqId') reqId: string,
    @Res() res: Response
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const result = await this.workflowService.triggerStreaming(
      type as 'create' | 'implement' | 'update',
      reqId,
      (line: string) => {
        res.write(`data: ${JSON.stringify({ type: 'log', message: line })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ type: 'done', success: result.success, message: result.message })}\n\n`);
    res.end();
  }
}
