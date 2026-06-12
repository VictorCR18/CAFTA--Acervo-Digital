import fs from 'fs/promises'
import path from 'path'
import { env } from '../config/env'

/**
 * Remove a file from disk given its relative path (e.g. "imagens/abc.webp").
 * Fails silently if the file doesn't exist — never throws.
 */
export async function deleteFile(relativePath: string): Promise<void> {
  try {
    const abs = path.join(env.UPLOAD_DIR, relativePath)
    await fs.unlink(abs)
  } catch {
    // File already gone — that's fine
  }
}
