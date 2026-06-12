/**
 * fileCleanup.ts — mantido para compatibilidade, mas não usado com R2.
 * O storage agora é feito via Cloudflare R2 (src/config/r2.ts).
 */
export async function deleteFile(_relativePath: string): Promise<void> {
  // No-op: arquivos são deletados do R2 via deleteFromR2() no controller
}