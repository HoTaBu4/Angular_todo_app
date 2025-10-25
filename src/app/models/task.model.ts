export type TaskStatus = 'Completed' | 'Pending' | 'Planned';

export interface Task {
  name: string;
  status: TaskStatus;
  date: string;
  description: string;
  isExpanded?: boolean;
}

export type TaskStatusFilter = TaskStatus | 'all';

export interface TaskFilters {
  name: string;
  date: string;
  status: TaskStatusFilter;
}
