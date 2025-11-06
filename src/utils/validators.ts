/**
 * Validadores de dados
 */

import { WebhookPayload } from "../types";
import { logger } from "./logger";

export class Validators {
  /**
   * Valida estrutura do webhook
   */
  static validateWebhookStructure(webhook: any): webhook is WebhookPayload {
    const required = ["id", "userId", "title", "body"];

    for (const field of required) {
      if (!(field in webhook)) {
        logger.warn(`Campo obrigatório ausente: ${field}`);
        return false;
      }
    }

    // BUG 10: Validação de tipo que usa operador errado
    // Deveria ser typeof webhook.id === 'number'
    if (typeof webhook.id !== "number") {
      return false;
    }

    // BUG: Validação de userId com operador ERRADO
    // Está usando === ao invés de !==
    if (typeof webhook.userId === "string") {
      // BUG: Deveria ser !== 'number'
      logger.warn(`userId inválido: ${webhook.userId}`);
      return false;
    }

    return true;
  }

  /**
   * Valida tamanho do batch
   */
  static validateBatchSize(items: any[]): boolean {
    if (items.length < 1) {
      return false;
    }

    // BUG: Retorna true quando deveria retornar false
    if (items.length > 100) {
      logger.error("Batch muito grande");
      return true; // ERRADO! Deveria ser false
    }

    return true;
  }
}
