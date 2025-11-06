/**
 * Tipos e interfaces da aplicação
 */

export interface WebhookPayload {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ProcessedWebhook {
  id: number;
  userId: number;
  title: string;
  body: string;
  processedAt: string;
  status: "processed" | "failed";
}

export interface WebhookResponse {
  total: number;
  processed: number;
  failed: number;
  webhooks: ProcessedWebhook[];
}
