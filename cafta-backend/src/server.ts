import { createApp } from "./app";
import { env } from "./config/env";
import { checkConnection, prisma } from "./config/prisma";

async function bootstrap() {
  await checkConnection();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀  Servidor rodando em http://localhost:${env.PORT}`);
    console.log(`📁  Uploads em: ${env.R2_BUCKET_NAME}`);
    console.log(`🌐  CORS liberado para: ${env.CORS_ORIGIN}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n⚠️   ${signal} recebido. Encerrando...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("✅  Conexões encerradas. Bye!");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("❌  Falha ao iniciar o servidor:", err);
  process.exit(1);
});
