import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/pool-analysis", {
    poolAddress: request.poolAddress,
    token: request.token,
  });
  return { deliverable: JSON.stringify(data) };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.poolAddress && !request.token) {
    return { valid: false, reason: "Provide either poolAddress or token" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Pool analysis for ${request.poolAddress || request.token}`;
}
