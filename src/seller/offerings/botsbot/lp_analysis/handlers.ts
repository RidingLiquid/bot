import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/pool-analysis", {
    poolAddress: request.poolAddress,
    walletAddress: request.walletAddress,
    token: request.token,
    mode: "lp",
  });
  return { deliverable: JSON.stringify(data) };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.poolAddress && !request.walletAddress && !request.token) {
    return { valid: false, reason: "Provide poolAddress, walletAddress, or token" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `LP analysis for ${request.poolAddress || request.walletAddress || request.token}`;
}
