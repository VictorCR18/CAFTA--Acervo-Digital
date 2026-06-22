import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        username: string;
      };
    }
  }
}