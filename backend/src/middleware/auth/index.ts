/**
 * @summary
 * Authentication middleware.
 * Handles user authentication and attaches user context to the request.
 *
 * @module middleware/auth
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @interface AuthenticatedRequest
 * @description Extended Express Request interface with user context
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @summary
 * Middleware to authenticate requests.
 * Currently implements a mock authentication for development purposes.
 *
 * @function authMiddleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Mock authentication - In a real app, this would verify a JWT token
  // For this feature development, we simulate a logged-in user
  (req as AuthenticatedRequest).user = {
    id: '550e8400-e29b-41d4-a716-446655440000', // Mock User UUID
    email: 'user@example.com',
  };
  next();
};
