import { Router } from 'express'
import { getPendingCountHandler } from '../controllers/admin.controller'

const router = Router()

/** GET /api/admin/pending-count
 * Get count of pending media items (status: processando)
 */
router.get('/pending-count', getPendingCountHandler)

export default router