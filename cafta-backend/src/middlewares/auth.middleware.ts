import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.admin = {
      id: (decoded as any).adminId,
      username: (decoded as any).username,
    };
    next();
    return;
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};
