import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { SkillsService } from './skills.service';

interface SaveContentDto {
  readonly content: string;
}

interface CreateWorkflowDto {
  readonly name: string;
  readonly content: string;
}

@Controller('skills-admin')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // --- Skills ---

  @Get('skills')
  public listSkills() {
    return this.skillsService.listSkills();
  }

  @Get('skills/:filename')
  public getSkill(@Param('filename') filename: string) {
    return this.skillsService.getSkill(filename);
  }

  @Put('skills/:filename')
  public saveSkill(
    @Param('filename') filename: string,
    @Body() dto: SaveContentDto,
  ) {
    return this.skillsService.saveSkill(filename, dto.content);
  }

  // --- Commands ---

  @Get('commands')
  public listCommands() {
    return this.skillsService.listCommands();
  }

  @Get('commands/:filename')
  public getCommand(@Param('filename') filename: string) {
    return this.skillsService.getCommand(filename);
  }

  @Put('commands/:filename')
  public saveCommand(
    @Param('filename') filename: string,
    @Body() dto: SaveContentDto,
  ) {
    return this.skillsService.saveCommand(filename, dto.content);
  }

  // --- Workflows ---

  @Get('workflows')
  public listWorkflows() {
    return this.skillsService.listWorkflows();
  }

  @Get('workflows/:filename')
  public getWorkflow(@Param('filename') filename: string) {
    return this.skillsService.getWorkflow(filename);
  }

  @Put('workflows/:filename')
  public saveWorkflow(
    @Param('filename') filename: string,
    @Body() dto: SaveContentDto,
  ) {
    return this.skillsService.saveWorkflow(filename, dto.content);
  }

  @Post('workflows')
  public createWorkflow(@Body() dto: CreateWorkflowDto) {
    return this.skillsService.createWorkflow(dto.name, dto.content);
  }

  // --- Create Skill ---

  @Post('skills')
  public createSkill(@Body() dto: CreateWorkflowDto) {
    return this.skillsService.createSkill(dto.name, dto.content);
  }

  // --- Create Command ---

  @Post('commands')
  public createCommand(@Body() dto: CreateWorkflowDto) {
    return this.skillsService.createCommand(dto.name, dto.content);
  }

  // --- LLM Linking Context ---

  @Get(':type/:filename/linking-context')
  public getLinkingContext(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    if (type !== 'skills' && type !== 'commands') {
      return { claudeMd: '', workflows: [], targetContent: '' };
    }
    return this.skillsService.getLinkingContext(type as 'skills' | 'commands', filename);
  }

  @Post('apply-linking')
  public applyLinking(@Body() dto: { changes: Array<{ file: string; content: string }> }) {
    return this.skillsService.applyLinking(dto.changes);
  }
}
