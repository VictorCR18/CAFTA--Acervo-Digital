import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

/** GET /api/admin/pending-count
 * Get count of pending media items (status: processando)
 */
export const getPendingCountHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await prisma.midia.count({
      where: {
        status: 'processando'
      }
    })

    res.json({ success: true, data: { count } })
  }
)