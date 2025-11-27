/**
 * @summary
 * Validation schemas for Task Management module using Zod.
 * Defines validation rules for creation, update, and filtering of tasks.
 *
 * @module services/task/taskValidation
 */

import { z } from 'zod';
import { TaskPriority, TaskStatus, SortField, SortOrder } from './taskTypes';
import { zDateString, zNullableDescription } from '@/utils/validation';

/**
 * @rule {VA-001} Title must be between 3 and 150 characters
 * @rule {VA-002} Due date cannot be in the past
 * @rule {VA-003} Priority must be valid enum
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title must be at most 150 characters'),
  description: zNullableDescription.optional(),
  dueDate: zDateString.refine((date) => new Date(date) >= new Date(), {
    message: 'Due date cannot be in the past',
  }),
  priority: z.nativeEnum(TaskPriority).optional(),
});

/**
 * @rule {AC-018} Update validation rules
 */
export const updateTaskSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: zNullableDescription.optional(),
  dueDate: zDateString
    .refine((date) => new Date(date) >= new Date(), {
      message: 'Due date cannot be in the past',
    })
    .optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

/**
 * @rule {FC-002} Filtering and sorting validation
 */
export const filterTaskSchema = z.object({
  status: z.union([z.nativeEnum(TaskStatus), z.array(z.nativeEnum(TaskStatus))]).optional(),
  priority: z.union([z.nativeEnum(TaskPriority), z.array(z.nativeEnum(TaskPriority))]).optional(),
  sortBy: z.nativeEnum(SortField).optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

/**
 * @rule {FC-005} Status change validation
 */
export const changeStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});
