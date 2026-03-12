import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { DatabaseService } from './database/database.service';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/(.*)']
    })
  ],
  controllers: [BoardController, WorkflowController, ChatController],
  providers: [DatabaseService, BoardService, WorkflowService, ChatService]
})
export class AppModule {}
