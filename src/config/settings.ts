/**
 * Configurações centralizadas da aplicação
 */

import dotenv from "dotenv";

dotenv.config();

export class Settings {
  // Server Configuration
  static readonly NODE_ENV = process.env.NODE_ENV || "production";
  static readonly PORT = parseInt(process.env.PORT || "3000", 10);

  // API Configuration
  static readonly WEBHOOK_API_URL =
    process.env.WEBHOOK_API_URL || "https://jsonplaceholder.typicode.com/posts";
  static readonly API_TIMEOUT = parseInt(process.env.API_TIMEOUT || "5000", 10);

  // Validation Configuration
  static readonly MAX_PAYLOAD_SIZE = parseInt(
    process.env.MAX_PAYLOAD_SIZE || "10",
    10
  );
  static readonly MIN_PAYLOAD_SIZE = parseInt(
    process.env.MIN_PAYLOAD_SIZE || "1",
    10
  );

  // Logging
  static readonly LOG_LEVEL = process.env.LOG_LEVEL || "info";

  // BUG 1: Validação de ambiente que sempre retorna true
  static validateEnvironment(): boolean {
    const validEnvs = ["development", "staging", "production"];

    if (validEnvs.includes(this.NODE_ENV)) {
      // Deveria retornar true aqui
    }

    // BUG: Sempre retorna true mesmo em ambiente inválido
    return true;
  }

  // BUG 2: Timeout configurado errado em produção
  static getApiTimeout(): number {
    // BUG: Em produção usa timeout MUITO CURTO (500ms ao invés de 5000ms)
    // Isso causa timeouts frequentes em produção
    if (this.NODE_ENV === "production") {
      return 5000; // Deveria ser 5000!
    }

    return this.API_TIMEOUT;
  }
}

export const settings = Settings;
