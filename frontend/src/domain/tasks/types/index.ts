export * from './forms';

export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskStatus = 'Pendente' | 'Em Andamento' | 'Concluída';

export interface Task {
  task_id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  sort_by?: 'due_date' | 'priority' | 'created_at';
  sort_order?: 'asc' | 'desc';
}
