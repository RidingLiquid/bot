import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost, resolveTokenAddress, SWAP_WALLET } from "../api-client.js";

export function requestAdditionalFunds(request: any): {
  content?: string;
  amount: number;
  tokenAddress: string;
  recipient: string;
} {
  const tokenInAddr = resolveTokenAddress(request.tokenIn);
  return {
    content: `Transfer ${request.amountIn} ${request.tokenIn} for swap execution`,
    amount: parseFloat(request.amountIn),
    tokenAddress: tokenInAddr!,
    recipient: SWAP_WALLET,
  };
}

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/swap", {
    tokenIn: request.tokenIn,
    tokenOut: request.tokenOut,
    amountIn: request.amountIn,
    slippage: request.slippage,
    walletAddress: SWAP_WALLET,
  });

  if (!data.success) {
    return {
      deliverable: JSON.stringify({
        success: false,
        error: data.error || "Swap failed",
        safety: data.safety,
      }),
    };
  }

  const tokenOutAddr = resolveTokenAddress(request.tokenOut) || data.tokenOut;
  return {
    deliverable: JSON.stringify({
      success: true,
      txHash: data.txHash,
      tokenOut: tokenOutAddr,
      amountOut: data.amountOut,
      priceImpact: data.priceImpact,
      safety: data.safety,
    }),
    payableDetail: {
      tokenAddress: tokenOutAddr,
      amount: parseFloat(data.amountOut || "0"),
    },
  };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.tokenIn || !request.tokenOut) {
    return { valid: false, reason: "tokenIn and tokenOut are required" };
  }
  if (!request.amountIn) {
    return { valid: false, reason: "amountIn is required" };
  }
  if (!resolveTokenAddress(request.tokenIn)) {
    return { valid: false, reason: `Unknown tokenIn: ${request.tokenIn}` };
  }
  if (!resolveTokenAddress(request.tokenOut)) {
    return { valid: false, reason: `Unknown tokenOut: ${request.tokenOut}` };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Swap: ${request.amountIn} ${request.tokenIn} → ${request.tokenOut}. Safety audit + on-chain execution.`;
}
