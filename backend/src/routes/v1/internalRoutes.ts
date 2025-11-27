/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import taskRoutes from './taskRoutes';

const router = Router();

/**
 * @rule {be-route-grouping}
 * Task Management Routes
 */
router.use('/tasks', taskRoutes);

export default router;
