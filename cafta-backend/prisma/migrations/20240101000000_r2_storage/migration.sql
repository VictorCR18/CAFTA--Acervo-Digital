-- Migration: Migração para Cloudflare R2
--
-- Mudança de semântica (sem alteração estrutural na tabela):
--   - pathRelativo: antes era caminho físico em disco (./uploads/imagens/uuid.jpg)
--                   agora é o key interno do bucket R2  (imagens/uuid.jpg)
--   - thumbnailPath: antes era caminho relativo em disco (imagens/thumbs/uuid.webp)
--                    agora é URL pública completa do R2  (https://acervo.../imagens/thumbs/uuid.webp)
--
-- Se houver registros existentes com paths de disco, rode o script de migração
-- em scripts/migrate-to-r2.ts antes de fazer deploy desta versão.

-- Nenhuma alteração de schema necessária — apenas semântica dos campos muda.
SELECT 1;
