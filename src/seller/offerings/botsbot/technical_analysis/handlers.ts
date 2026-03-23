import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/technical-analysis", {
    token: request.token,
    timeframe: request.timeframe || "4h",
  });
  return { deliverable: JSON.stringify(data) };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.token) {
    return { valid: false, reason: "token is required" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Technical analysis for ${request.token} (${request.timeframe || "4h"})`;
}
