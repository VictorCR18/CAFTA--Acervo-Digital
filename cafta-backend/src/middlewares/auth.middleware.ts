import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from cookies
 * Attaches admin info to request if valid
 */
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // Attach admin info to request
    req.admin = {
      id: (decoded as any).adminId,
      username: (decoded as any).username
    };
    next();
    return; // explicit return to satisfy TypeScript
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};