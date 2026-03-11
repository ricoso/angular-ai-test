export type RequirementStatus =
  | 'Draft'
  | 'In Review'
  | 'Approved'
  | 'In Progress'
  | 'Implemented'
  | 'Rejected';

export type RequirementPriority = 'High' | 'Medium' | 'Low';

export type RequirementLabel = 'User Story' | 'Technical Story';

export type KanbanColumn = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface RequirementMetadata {
  readonly priority: RequirementPriority;
  readonly label: RequirementLabel;
  readonly tags: string[];
  readonly prNumber: number | null;
  readonly reviewState: string | null;
  readonly lastUpdated: string | null;
}

export interface Requirement {
  readonly id: string;
  readonly name: string;
  readonly status: RequirementStatus;
  readonly priority: RequirementPriority;
  readonly label: RequirementLabel;
  readonly dependencies: string[];
  readonly description: string;
  readonly metadata: RequirementMetadata | null;
  readonly attachments: string[];
  readonly column: KanbanColumn;
}

export const STATUS_EMOJI_MAP: Record<RequirementStatus, string> = {
  'Draft': '📝',
  'In Review': '🔍',
  'Approved': '✅',
  'In Progress': '🚧',
  'Implemented': '✔️',
  'Rejected': '❌'
};

export const EMOJI_STATUS_MAP: Record<string, RequirementStatus> = {
  '📝': 'Draft',
  '🔍': 'In Review',
  '✅': 'Approved',
  '🚧': 'In Progress',
  '✔️': 'Implemented',
  '❌': 'Rejected'
};

export const STATUS_TO_COLUMN: Record<RequirementStatus, KanbanColumn> = {
  'Draft': 'todo',
  'Approved': 'todo',
  'In Progress': 'in-progress',
  'In Review': 'in-review',
  'Implemented': 'done',
  'Rejected': 'done'
};

export const COLUMN_TO_STATUS: Record<KanbanColumn, RequirementStatus> = {
  'todo': 'Draft',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Implemented'
};

export const COLUMN_LABELS: Record<KanbanColumn, string> = {
  'todo': 'To-Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done'
};
