import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import type { AcervoTipo } from "@/types";

async function authenticate(request: NextRequest): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin-token")?.value;
  return token === "authenticated";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const isAuthenticated = await authenticate(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const tipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
    let totalCount = 0;

    for (const tipo of tipos) {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        tipo,
        "pending",
      );

      try {
        const files = await fs.readdir(uploadDir);
        const count = files.filter((file: string) => !file.startsWith(".")).length;
        totalCount += count;
      } catch (err) {
        const fsError = err as NodeJS.ErrnoException;
        if (fsError.code !== "ENOENT") {
          console.error(
            `[admin/pending-count] Error reading ${tipo} directory:`,
            err,
          );
        }
      }
    }

    return NextResponse.json({ count: totalCount });
  } catch (error) {
    console.error("[admin/pending-count] Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";