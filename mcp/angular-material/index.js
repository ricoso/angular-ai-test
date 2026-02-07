#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const COMPONENTS = {
  button: { name: 'Button', example: '<button mat-raised-button color="primary">Click</button>' },
  dialog: { name: 'Dialog', example: 'dialog.open(Component, { width: \'400px\' })' },
  table: { name: 'Table', example: '<table mat-table [dataSource]="data"></table>' },
  'form-field': { name: 'Form Field', example: '<mat-form-field><input matInput /></mat-form-field>' }
};

const server = new Server({ name: 'angular-material', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'get_component', inputSchema: { type: 'object', properties: { component: { type: 'string', enum: Object.keys(COMPONENTS) } }, required: ['component'] } },
    { name: 'list_components', inputSchema: { type: 'object', properties: {} } }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === 'get_component') {
    const c = COMPONENTS[req.params.arguments.component];
    return { content: [{ type: 'text', text: `# ${c.name}\n\`\`\`typescript\n${c.example}\n\`\`\`` }] };
  }
  if (req.params.name === 'list_components') {
    return { content: [{ type: 'text', text: Object.keys(COMPONENTS).join(', ') }] };
  }
});

await server.connect(new StdioServerTransport());
