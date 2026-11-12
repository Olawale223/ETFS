import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { User } from './models';

export type AuthRequest = Request & { userId?: string };
export const asyncHandler = (fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);
export const auth = asyncHandler(async (req: AuthRequest, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.userId = (jwt.verify(token, config.jwtSecret) as { sub: string }).sub; } catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
  next();
});
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: err.issues });
  if (err?.code === 11000) return res.status(409).json({ error: 'A record with that value already exists' });
  const status = Number(err?.statusCode || err?.status || 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
};
export const notFound = (_req: Request, res: Response) => res.status(404).json({ error: 'Not found' });
