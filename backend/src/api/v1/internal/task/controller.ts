/**
 * @summary
 * API Controller for Task Management.
 * Handles HTTP requests for creating, listing, updating, and deleting tasks.
 *
 * @module api/v1/internal/task/controller
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { successResponse } from '@/utils/response';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  changeTaskStatus,
  createTaskSchema,
  updateTaskSchema,
  filterTaskSchema,
  changeStatusSchema,
} from '@/services/task';

/**
 * @summary
 * Creates a new task.
 * POST /api/v1/internal/tasks
 */
export async function createHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const validatedData = await createTaskSchema.parseAsync(req.body);
    const task = await createTask(userId, validatedData);
    res.status(201).json(successResponse(task));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Lists tasks with filters and pagination.
 * GET /api/v1/internal/tasks
 */
export async function listHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    // Handle query parameters that might be arrays or single values
    const queryParams = {
      ...req.query,
      // Ensure arrays for multi-value filters if needed, handled by Zod or service
    };
    const validatedFilters = await filterTaskSchema.parseAsync(queryParams);
    const result = await getTasks(userId, validatedFilters);
    res.json(successResponse(result.tasks, { pagination: { ...result, tasks: undefined } }));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Gets a specific task by ID.
 * GET /api/v1/internal/tasks/:id
 */
export async function getHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    const task = await getTaskById(userId, taskId);
    res.json(successResponse(task));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Updates a task.
 * PUT /api/v1/internal/tasks/:id
 */
export async function updateHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    const validatedData = await updateTaskSchema.parseAsync(req.body);
    const task = await updateTask(userId, taskId, validatedData);
    res.json(successResponse(task));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Deletes a task (soft delete).
 * DELETE /api/v1/internal/tasks/:id
 */
export async function deleteHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    await deleteTask(userId, taskId);
    res.json(successResponse(null, { message: 'Task deleted successfully' }));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Changes task status.
 * PATCH /api/v1/internal/tasks/:id/status
 */
export async function statusHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    const validatedData = await changeStatusSchema.parseAsync(req.body);
    const task = await changeTaskStatus(userId, taskId, validatedData.status);
    res.json(successResponse(task));
  } catch (error) {
    next(error);
  }
}
