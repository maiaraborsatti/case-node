/**
 * Aplicação Principal - Sistema de Processamento de Webhooks
 *
 * Este sistema coleta webhooks de uma API externa, processa e salva em JSON.
 * Simula processamento de webhooks em produção.
 */

import { settings } from "./config/settings";
import { logger } from "./utils/logger";
import { WebhookService } from "./services/webhookService";
import { FileWriter } from "./utils/fileWriter";

class Application {
  private webhookService: WebhookService;
  private fileWriter: FileWriter;

  constructor() {
    logger.info("=".repeat(70));
    logger.info("SISTEMA DE PROCESSAMENTO DE WEBHOOKS v2.0");
    logger.info("=".repeat(70));
    logger.info(`Ambiente: ${settings.NODE_ENV}`);
    logger.info(`Porta: ${settings.PORT}`);
    logger.info(`Timeout API: ${settings.getApiTimeout()}ms`);
    logger.info("");

    this.webhookService = new WebhookService();
    this.fileWriter = new FileWriter();

    // Valida ambiente
    if (!settings.validateEnvironment()) {
      logger.error("Ambiente inválido!");
      logger.error("Configure NODE_ENV corretamente");
      // BUG 9: Não faz process.exit(1), continua executando
    }
  }

  async run(): Promise<void> {
    try {
      logger.info("PASSO 1: Configurando ambiente...");
      await this.fileWriter.ensureOutputDir();

      logger.info("\nPASSO 2: Coletando webhooks da API...");
      const webhooks = await this.webhookService.fetchWebhooks();

      if (!webhooks || webhooks.length === 0) {
        logger.error("✗ Nenhum webhook coletado");
        process.exit(1);
      }

      logger.info("\nPASSO 3: Processando e validando webhooks...");
      const processed = await this.webhookService.filterValidWebhooks(webhooks);

      logger.info("\nPASSO 4: Filtrando top 5 webhooks...");
      const topWebhooks = this.webhookService.getTopWebhooks(processed, 5);

      logger.info("\nPASSO 5: Salvando resultados...");
      const saved = await this.fileWriter.saveToJson(topWebhooks);

      if (!saved) {
        logger.error("✗ Falha ao salvar arquivo");
        process.exit(1);
      }

      // Salva resumo
      const summary = {
        total: webhooks.length,
        processed: processed.length,
        saved: topWebhooks.length,
        environment: settings.NODE_ENV,
        timestamp: new Date().toISOString(),
      };

      await this.fileWriter.saveSummary(summary);

      // Sucesso!
      logger.info("\n" + "=".repeat(70));
      logger.info("✓ PROCESSAMENTO CONCLUÍDO COM SUCESSO!");
      logger.info("=".repeat(70));
      logger.info(`Total processado: ${topWebhooks.length} webhooks`);
      logger.info(`Arquivo: output/webhooks_processados.json`);
    } catch (error) {
      logger.error(`Erro durante execução: ${error}`);
      process.exit(1);
    }
  }
}

// Executa aplicação
const app = new Application();

app.run().catch((error) => {
  logger.error(`Erro crítico: ${error}`);
  process.exit(1);
});
