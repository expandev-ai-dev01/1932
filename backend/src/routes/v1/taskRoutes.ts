/**
 * @summary
 * Task Management Routes.
 * Defines API endpoints for task operations.
 *
 * @module routes/v1/taskRoutes
 */

import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Apply authentication to all task routes
router.use(authMiddleware);

/**
 * @route GET /api/v1/internal/tasks
 * @description List tasks with filters
 */
router.get('/', taskController.listHandler);

/**
 * @route POST /api/v1/internal/tasks
 * @description Create a new task
 */
router.post('/', taskController.createHandler);

/**
 * @route GET /api/v1/internal/tasks/:id
 * @description Get task details
 */
router.get('/:id', taskController.getHandler);

/**
 * @route PUT /api/v1/internal/tasks/:id
 * @description Update task details
 */
router.put('/:id', taskController.updateHandler);

/**
 * @route DELETE /api/v1/internal/tasks/:id
 * @description Delete a task
 */
router.delete('/:id', taskController.deleteHandler);

/**
 * @route PATCH /api/v1/internal/tasks/:id/status
 * @description Change task status
 */
router.patch('/:id/status', taskController.statusHandler);

export default router;
