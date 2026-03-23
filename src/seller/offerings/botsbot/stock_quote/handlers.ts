import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiGet } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiGet("/api/v1/stock-quote", { symbol: request.symbol });
  return { deliverable: JSON.stringify(data) };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.symbol) {
    return { valid: false, reason: "symbol is required (e.g. 'AAPL')" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Stock quote for ${request.symbol}`;
}
