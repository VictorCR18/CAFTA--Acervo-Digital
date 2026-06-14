-- CreateEnum
CREATE TYPE "MidiaTipo" AS ENUM ('imagens', 'videos', 'artigos');

-- CreateEnum
CREATE TYPE "MidiaStatus" AS ENUM ('ativo', 'inativo', 'processando');

-- CreateTable
CREATE TABLE "midias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "MidiaTipo" NOT NULL,
    "filename" TEXT NOT NULL,
    "filenameOriginal" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "tamanhoBytes" BIGINT NOT NULL,
    "pathRelativo" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "status" "MidiaStatus" NOT NULL DEFAULT 'ativo',
    "description" TEXT,
    "categoryId" TEXT,
    "historicalPeriod" TEXT,
    "authorship" TEXT,
    "publicationDate" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "midias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesquisas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autores" JSONB NOT NULL DEFAULT '[]',
    "ano" INTEGER NOT NULL,
    "link" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pesquisas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "midias_filename_key" ON "midias"("filename");

-- CreateIndex
CREATE INDEX "midias_tipo_idx" ON "midias"("tipo");

-- CreateIndex
CREATE INDEX "midias_status_idx" ON "midias"("status");

-- CreateIndex
CREATE INDEX "midias_criadoEm_idx" ON "midias"("criadoEm" DESC);

-- CreateIndex
CREATE INDEX "pesquisas_ano_idx" ON "pesquisas"("ano" DESC);

-- CreateIndex
CREATE INDEX "pesquisas_destaque_idx" ON "pesquisas"("destaque");
