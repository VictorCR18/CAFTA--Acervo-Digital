# CAFTA Backend

API REST — Node.js + Express + TypeScript + PostgreSQL (Prisma) + Cloudflare R2

## Stack

| Camada       | Tecnologia                       |
|--------------|----------------------------------|
| Runtime      | Node.js 20+                      |
| Framework    | Express 4                        |
| Linguagem    | TypeScript 5                     |
| ORM          | Prisma 5 + PostgreSQL            |
| Storage      | Cloudflare R2 (S3-compatible)    |
| Processamento| Sharp (thumbnail + strip EXIF)   |
| Validação    | Zod                              |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
PORT=4000
NODE_ENV=development

DATABASE_URL=postgresql://usuario:senha@localhost:5432/cafta_db

UPLOAD_MAX_MB=100

R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=sua_access_key_id
R2_SECRET_ACCESS_KEY=sua_secret_access_key
R2_BUCKET_NAME=cafta-acervo
R2_PUBLIC_URL=https://acervo.cafta.ufc.br

CORS_ORIGIN=http://localhost:3000
```

## Configurando o Cloudflare R2

1. **Criar conta** em [cloudflare.com](https://cloudflare.com) (plano gratuito)
2. **Criar bucket**: Dashboard → R2 → Create Bucket → nome: `cafta-acervo`
3. **Ativar acesso público**: R2 → `cafta-acervo` → Settings → Public Access → Allow
   - Anote a URL gerada (`https://<hash>.r2.dev`) ou configure um domínio próprio
4. **Gerar credenciais**: R2 → Manage R2 API Tokens → Create API Token
   - Permissions: **Object Read & Write**
   - Bucket: `cafta-acervo`
   - Anote `Access Key ID` e `Secret Access Key`
5. **Account ID**: canto superior direito do dashboard → copiar Account ID

## Instalação

```bash
npm install
npx prisma migrate dev
npx prisma db seed   # opcional — popula dados de exemplo
npm run dev
```

## Migração de uploads existentes (disco → R2)

Se já havia arquivos na pasta `./uploads`, rode **antes** do primeiro deploy:

```bash
OLD_UPLOAD_DIR=./uploads npx tsx scripts/migrate-to-r2.ts
```

O script faz upload de cada arquivo para o R2, atualiza as thumbnailPaths no banco
para URLs públicas e reporta o resultado. Depois confirme os uploads e apague a pasta local.

## Endpoints

### Mídias (`/api/midias`)

| Método | Rota              | Descrição                        |
|--------|-------------------|----------------------------------|
| POST   | `/api/midias`     | Upload de arquivo (multipart)    |
| GET    | `/api/midias`     | Lista com filtros e paginação    |
| GET    | `/api/midias/:id` | Busca mídia por ID               |
| DELETE | `/api/midias/:id` | Remove mídia e arquivo do R2     |

**POST** — campos do formulário:
- `titulo` (string) — título do arquivo
- `tipo` (enum) — `imagens` | `videos` | `artigos`
- `arquivo` (file) — o arquivo a ser enviado

### Pesquisas (`/api/pesquisas`)

| Método | Rota                  | Descrição               |
|--------|-----------------------|-------------------------|
| GET    | `/api/pesquisas`      | Lista pesquisas          |
| POST   | `/api/pesquisas`      | Cria pesquisa            |
| PATCH  | `/api/pesquisas/:id`  | Atualiza pesquisa        |
| DELETE | `/api/pesquisas/:id`  | Remove pesquisa          |

## Fluxo de upload

```
Cliente → POST /api/midias (multipart)
  └─ multer (memoryStorage) → req.file.buffer
       └─ createMidia() → banco (status: processando)
            └─ setImmediate (pós-processamento)
                 ├─ [imagens] stripExifBuffer() → uploadToR2(original)
                 │            generateThumbnailBuffer() → uploadToR2(thumb)
                 │            updateMidiaThumbnail() → banco (status: ativo)
                 └─ [outros]  uploadToR2(arquivo)
                              updateMidiaStatus(ativo) → banco
```

Arquivos nunca tocam o disco do servidor — tudo é processado em memória e enviado diretamente para o R2.

## Scripts

```bash
npm run dev           # servidor com hot-reload
npm run build         # compila TypeScript
npm run start         # inicia build compilado
npm run db:migrate    # aplica migrations (dev)
npm run db:migrate:prod # aplica migrations (prod)
npm run db:seed       # popula dados de exemplo
npm run db:studio     # Prisma Studio (GUI do banco)
npm run type-check    # verifica tipos sem compilar
```
