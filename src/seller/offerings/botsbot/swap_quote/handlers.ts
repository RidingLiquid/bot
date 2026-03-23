import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/swap-quote", {
    tokenIn: request.tokenIn,
    tokenOut: request.tokenOut,
    amountIn: request.amountIn,
  });

  // Format a useful response even when no quote is available
  if (!data.success || data.error || !data.data?.amountOut) {
    return {
      deliverable: JSON.stringify({
        status: "no_quote",
        tokenIn: request.tokenIn,
        tokenOut: request.tokenOut,
        amountIn: request.amountIn,
        reason:
          data.error ||
          data.data?.error ||
          "No liquidity available for this token pair on Base chain. The token may have no DEX pools or insufficient liquidity for this amount.",
        suggestion:
          "Try a different token pair, smaller amount, or check that the token has active liquidity pools.",
      }),
    };
  }

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
