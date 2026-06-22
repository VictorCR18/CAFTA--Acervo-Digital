import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/** GET /api/admin/pending-count
 * Get count of pending media items (status: processando)
 */
export const getPendingCountHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await prisma.midia.count({
      where: {
        status: "processando",
      },
    });

    res.json({ success: true, data: { count } });
  },
);

/** POST /api/admin/login
 * Admin login with password
 */
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ success: false, error: "Password is required" });
      return;
    }

    // Find the admin user (we assume there is an admin with username 'admin')
    const admin = await prisma.admin.findFirst({
      where: {
        username: "admin",
      },
    });

    if (!admin) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // Set the token in an HTTP-only cookie
    res.json({ success: true, data: { message: "Login successful", token } });
  },
);

/** POST /api/admin/logout
 * Admin logout (clear cookie)
 */
export const logoutHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0), // Expire immediately
    });

    res.json({ success: true, data: { message: "Logged out" } });
  },
);

/** PUT /api/admin/password
 * Update admin password (requires old password)
 */
export const updatePasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new AppError("Old password and new password are required", 400);
    }

    // Get admin from request (attached by authenticateAdmin middleware)
    const adminId = req.admin?.id;
    if (!adminId) {
      throw new AppError("Admin not found in request", 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!passwordMatch) {
      throw new AppError("Old password is incorrect", 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, data: { message: "Password updated" } });
  },
);
