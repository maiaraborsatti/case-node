/**
 * Serviço de processamento de webhooks
 */

import axios from "axios";
import { settings } from "../config/settings";
import { logger } from "../utils/logger";
import { WebhookPayload, ProcessedWebhook } from "../types";

export class WebhookService {
  private apiUrl: string;
  private timeout: number;

  constructor() {
    this.apiUrl = settings.WEBHOOK_API_URL;
    this.timeout = settings.getApiTimeout();
  }

  /**
   * Busca webhooks da API externa
   */
  async fetchWebhooks(): Promise<WebhookPayload[]> {
    try {
      logger.info(`Buscando webhooks da API: ${this.apiUrl}`);

      const response = await axios.get(this.apiUrl, {
        timeout: this.timeout,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // BUG 3: Não valida status code antes de processar
      // Deveria verificar response.status === 200
      const data = response.data as WebhookPayload[];

      logger.info(`✓ Webhooks coletados: ${data.length} registros`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processa um webhook individual
   */
  processWebhook(webhook: WebhookPayload): ProcessedWebhook | null {
    try {
      // BUG 4 (MUITO SUTIL): Para IDs múltiplos de 5, acessa campo que pode não existir
      if (webhook.id % 5 === 0 && webhook.id > 0) {
        // Tenta acessar campo que pode não estar presente
        const extraData = webhook.userId.toString().split("");

        // BUG: Se userId for undefined, causa erro
        // BUG ADICIONAL: Validação impossível
        if (extraData.length < 0) {
          logger.warn(`Webhook ${webhook.id} com dados inválidos`);
          return null;
        }
      }

      // Processa normalmente
      const processed: ProcessedWebhook = {
        id: webhook.id,
        userId: webhook.userId,
        title: webhook.title,
        body: webhook.body,
        processedAt: new Date().toISOString(),
        status: "processed",
      };

      return processed;
    } catch (error) {
      logger.error(`Erro ao processar webhook ${webhook.id}: ${error}`);
      return null;
    }
  }

  /**
   * Valida payload do webhook
   */
  validatePayload(webhook: any): boolean {
    // Sugestão de validação de estrutura e tipo
    if (!webhook || typeof webhook !== "object") {
      logger.warn("Payload inválido ou indefinido");
      return false;
    }

    // Validação básica
    if (!webhook.id || !webhook.userId) {
      logger.warn("Webhook sem ID ou userId");
      return false;
    }

    // Sugestão de validação se há título
    if (!webhook.title) {
      logger.warn("Webhook sem título");
      return false;
    }

    // Correção e sugestão de validação de tamanho do título
    if (webhook.title.length > 200) {
      logger.warn(`Título muito longo para o webhook ${webhook.id}`);
      return false;
    }

    return true;
  }

  /**
   * Filtra webhooks válidos
   */
  async filterValidWebhooks(
    webhooks: WebhookPayload[]
  ): Promise<ProcessedWebhook[]> {
    logger.info(`Filtrando ${webhooks.length} webhooks...`);

    const validWebhooks: ProcessedWebhook[] = [];

    for (const webhook of webhooks) {
      // Valida payload
      if (!this.validatePayload(webhook)) {
        logger.warn(`Webhook ${webhook.id} inválido`);
        continue;
      }

      // Processa webhook
      const processed = this.processWebhook(webhook);

      if (processed) {
        validWebhooks.push(processed);
      }
    }

    logger.info(`✓ Webhooks válidos: ${validWebhooks.length}`);

    return validWebhooks;
  }

  /**
   * Filtra top N webhooks
   */
  getTopWebhooks(
    webhooks: ProcessedWebhook[],
    limit: number = 5
  ): ProcessedWebhook[] {
    // BUG 6 (CRÍTICO): Ordenação errada
    // Deveria ordenar por ID crescente, mas está decrescente
    // Isso faz pegar os últimos ao invés dos primeiros
    const sorted = [...webhooks].sort((a, b) => a.id - b.id); // BUG: Ordem errada!

    return sorted.slice(0, limit);
  }
}
