import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responses';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);
  
  if (error.name === 'PrismaClientKnownRequestError') {
    sendError(res, 'Database error occurred', 500);
    return;
  }
  
  sendError(res, 'Internal server error', 500, error.message);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};