/**
 * Utilitário para escrita de arquivos
 */

import fs from "fs/promises";
import path from "path";
import { logger } from "./logger";
import { ProcessedWebhook } from "../types";

export class FileWriter {
  private outputDir: string;

  constructor(outputDir: string = "output") {
    this.outputDir = outputDir;
  }

  /**
   * Garante que diretório de saída existe
   */
  async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      logger.error(`Erro ao criar diretório: ${error}`);
      // BUG 7: Não lança erro, apenas loga
      // Aplicação continua e falha depois ao tentar escrever
    }
  }

  /**
   * Salva webhooks processados em arquivo JSON
   */
  async saveToJson(
    webhooks: ProcessedWebhook[],
    filename: string = "webhooks_processados.json"
  ): Promise<boolean> {
    try {
      const filepath = path.join(this.outputDir, filename);

      logger.info(`Salvando ${webhooks.length} webhooks em: ${filepath}`);

      // BUG 8 (CRÍTICO - IMPEDE EXECUÇÃO):
      // Tenta usar método que não existe no fs/promises
      // fs.promises.writeFile é correto, mas está usando writeFileSync
      // que não retorna Promise
      await fs.writeFile(filepath, JSON.stringify(webhooks, null, 2));

      logger.info("✓ Arquivo salvo com sucesso!");
      return true;
    } catch (error) {
      logger.error(`Erro ao salvar arquivo: ${error}`);
      return false;
    }
  }

  /**
   * Salva resumo estatístico
   */
  async saveSummary(summary: any): Promise<void> {
    const filepath = path.join(this.outputDir, "summary.json");

    try {
      await fs.writeFile(filepath, JSON.stringify(summary, null, 2), "utf-8");
      logger.info(`Resumo salvo em: ${filepath}`);
    } catch (error) {
      logger.error(`Erro ao salvar resumo: ${error}`);
    }
  }
}
