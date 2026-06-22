import { Router } from 'express'
import { getPendingCountHandler, loginHandler, logoutHandler, updatePasswordHandler } from '../controllers/admin.controller'
import { authenticateAdmin } from '../middlewares/auth.middleware'

const router = Router()

/** POST /api/admin/login
 * Admin login with password
 */
router.post('/login', loginHandler)

/** POST /api/admin/logout
 * Admin logout (clear cookie)
 */
router.post('/logout', logoutHandler)

/** GET /api/admin/pending-count
 * Get count of pending media items (status: processando)
 * Protected route - requires authentication
 */
router.get('/pending-count', authenticateAdmin, getPendingCountHandler)

/** PUT /api/admin/password
 * Update admin password (requires old password)
 * Protected route - requires authentication
 */
router.put('/password', authenticateAdmin, updatePasswordHandler)

export default router