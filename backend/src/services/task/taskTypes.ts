/**
 * @summary
 * Type definitions for the Task Management module.
 * Includes enums, entity interfaces, and DTOs.
 *
 * @module services/task/taskTypes
 */

/**
 * @enum TaskPriority
 * @description Priority levels for tasks
 */
export enum TaskPriority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
}

/**
 * @enum TaskStatus
 * @description Status workflow states for tasks
 */
export enum TaskStatus {
  Pending = 'Pendente',
  InProgress = 'Em Andamento',
  Completed = 'Concluída',
}

/**
 * @enum SortField
 * @description Allowed fields for sorting tasks
 */
export enum SortField {
  DueDate = 'due_date',
  Priority = 'priority',
  CreatedAt = 'created_at',
}

/**
 * @enum SortOrder
 * @description Sort direction
 */
export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

/**
 * @interface TaskEntity
 * @description Represents a task in the system
 */
export interface TaskEntity {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * @interface CreateTaskDTO
 * @description Data transfer object for creating a task
 */
export interface CreateTaskDTO {
  title: string;
  description?: string | null;
  dueDate: string;
  priority?: TaskPriority;
}

/**
 * @interface UpdateTaskDTO
 * @description Data transfer object for updating a task
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  dueDate?: string;
  priority?: TaskPriority;
}

/**
 * @interface TaskFilterDTO
 * @description Data transfer object for filtering and sorting tasks
 */
export interface TaskFilterDTO {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

/**
 * @interface TaskListResult
 * @description Result structure for paginated task list
 */
export interface TaskListResult {
  tasks: TaskEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
