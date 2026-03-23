import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost, resolveTokenAddress } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/swap-quote", {
    tokenIn: request.tokenIn,
    tokenOut: request.tokenOut,
    amountIn: request.amountIn,
  });
  return { deliverable: JSON.stringify(data) };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.tokenIn || !request.tokenOut) {
    return { valid: false, reason: "tokenIn and tokenOut are required" };
  }
  if (!request.amountIn) {
    return { valid: false, reason: "amountIn is required" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Swap quote: ${request.amountIn} ${request.tokenIn} → ${request.tokenOut}`;
}
