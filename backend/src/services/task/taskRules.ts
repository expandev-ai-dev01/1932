/**
 * @summary
 * Business logic and in-memory data storage for Task Management.
 * Implements CRUD operations, status transitions, and business rules.
 *
 * @module services/task/taskRules
 */

import { randomUUID } from 'crypto';
import {
  TaskEntity,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilterDTO,
  TaskStatus,
  TaskPriority,
  SortField,
  SortOrder,
  TaskListResult,
} from './taskTypes';
import { errorResponse } from '@/utils/response';

// In-memory storage
const tasks: TaskEntity[] = [];

/**
 * @summary
 * Creates a new task for a user.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {CreateTaskDTO} data - The task data
 * @returns {Promise<TaskEntity>} The created task
 */
export async function createTask(userId: string, data: CreateTaskDTO): Promise<TaskEntity> {
  const newTask: TaskEntity = {
    id: randomUUID(),
    userId,
    title: data.title,
    description: data.description || null,
    dueDate: new Date(data.dueDate),
    priority: data.priority || TaskPriority.Medium,
    status: TaskStatus.Pending,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  tasks.push(newTask);
  return newTask;
}

/**
 * @summary
 * Retrieves a paginated list of tasks for a user with filters and sorting.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {TaskFilterDTO} filters - Filter and sort options
 * @returns {Promise<TaskListResult>} Paginated result
 */
export async function getTasks(userId: string, filters: TaskFilterDTO): Promise<TaskListResult> {
  let filteredTasks = tasks.filter((task) => task.userId === userId && task.deletedAt === null);

  // Apply Status Filter
  if (filters.status) {
    const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
    filteredTasks = filteredTasks.filter((task) => statusArray.includes(task.status));
  } else {
    // Default: Pending and InProgress
    filteredTasks = filteredTasks.filter(
      (task) => task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress
    );
  }

  // Apply Priority Filter
  if (filters.priority) {
    const priorityArray = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
    filteredTasks = filteredTasks.filter((task) => priorityArray.includes(task.priority));
  }

  // Apply Sorting
  const sortBy = filters.sortBy || SortField.DueDate;
  const sortOrder = filters.sortOrder || SortOrder.Asc;

  filteredTasks.sort((a, b) => {
    let valA: any = a.dueDate;
    let valB: any = b.dueDate;

    if (sortBy === SortField.Priority) {
      // Map priority to numeric value for sorting
      const priorityMap = {
        [TaskPriority.Low]: 1,
        [TaskPriority.Medium]: 2,
        [TaskPriority.High]: 3,
      };
      valA = priorityMap[a.priority];
      valB = priorityMap[b.priority];
    } else if (sortBy === SortField.CreatedAt) {
      valA = a.createdAt;
      valB = b.createdAt;
    }

    if (valA < valB) return sortOrder === SortOrder.Asc ? -1 : 1;
    if (valA > valB) return sortOrder === SortOrder.Asc ? 1 : -1;
    return 0;
  });

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const total = filteredTasks.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(offset, offset + pageSize);

  return {
    tasks: paginatedTasks,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * @summary
 * Retrieves a specific task by ID.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {string} taskId - The ID of the task
 * @returns {Promise<TaskEntity>} The task entity
 * @throws {Error} If task not found or access denied
 */
export async function getTaskById(userId: string, taskId: string): Promise<TaskEntity> {
  const task = tasks.find((t) => t.id === taskId && t.userId === userId && t.deletedAt === null);
  if (!task) {
    const error: any = new Error('Task not found or access denied');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }
  return task;
}

/**
 * @summary
 * Updates an existing task.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {string} taskId - The ID of the task
 * @param {UpdateTaskDTO} data - Data to update
 * @returns {Promise<TaskEntity>} The updated task
 */
export async function updateTask(
  userId: string,
  taskId: string,
  data: UpdateTaskDTO
): Promise<TaskEntity> {
  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === userId && t.deletedAt === null
  );

  if (taskIndex === -1) {
    const error: any = new Error('Task not found or access denied');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : tasks[taskIndex].dueDate,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
}

/**
 * @summary
 * Soft deletes a task.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {string} taskId - The ID of the task
 * @returns {Promise<void>}
 */
export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === userId && t.deletedAt === null
  );

  if (taskIndex === -1) {
    const error: any = new Error('Task not found or access denied');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  tasks[taskIndex].deletedAt = new Date();
  tasks[taskIndex].updatedAt = new Date();
}

/**
 * @summary
 * Changes the status of a task enforcing transition rules.
 *
 * @param {string} userId - The ID of the authenticated user
 * @param {string} taskId - The ID of the task
 * @param {TaskStatus} newStatus - The new status
 * @returns {Promise<TaskEntity>} The updated task
 */
export async function changeTaskStatus(
  userId: string,
  taskId: string,
  newStatus: TaskStatus
): Promise<TaskEntity> {
  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === userId && t.deletedAt === null
  );

  if (taskIndex === -1) {
    const error: any = new Error('Task not found or access denied');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const currentStatus = tasks[taskIndex].status;

  // Validate transitions
  let isValidTransition = false;
  if (
    currentStatus === TaskStatus.Pending &&
    (newStatus === TaskStatus.InProgress || newStatus === TaskStatus.Completed)
  )
    isValidTransition = true;
  else if (
    currentStatus === TaskStatus.InProgress &&
    (newStatus === TaskStatus.Completed || newStatus === TaskStatus.Pending)
  )
    isValidTransition = true;
  else if (currentStatus === TaskStatus.Completed && newStatus === TaskStatus.Pending)
    isValidTransition = true;

  if (!isValidTransition && currentStatus !== newStatus) {
    const error: any = new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    error.code = 'INVALID_TRANSITION';
    error.statusCode = 400;
    throw error;
  }

  tasks[taskIndex].status = newStatus;
  tasks[taskIndex].updatedAt = new Date();

  return tasks[taskIndex];
}
