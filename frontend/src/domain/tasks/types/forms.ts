import { z } from 'zod';
import { taskSchema } from '../validations/task';

export type TaskFormInput = z.input<typeof taskSchema>;
export type TaskFormOutput = z.output<typeof taskSchema>;
