import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost, SWAP_WALLET } from "../api-client.js";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const VALID_VAULTS = ["aave", "gauntlet", "steakhouse", "moonwell", "avantis"];

export function requestAdditionalFunds(request: any): {
  content?: string;
  amount: number;
  tokenAddress: string;
  recipient: string;
} {
  return {
    content: `Transfer ${request.amount} USDC for ${request.vault} vault deposit`,
    amount: parseFloat(request.amount),
    tokenAddress: USDC_BASE,
    recipient: SWAP_WALLET,
  };
}

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/yield-deposit", {
    vault: request.vault,
    amount: request.amount,
    walletAddress: SWAP_WALLET,
  });

  if (!data.success) {
    return {
      deliverable: JSON.stringify({
        success: false,
        error: data.error || "Deposit failed",
      }),
    };
  }

  return {
    deliverable: JSON.stringify({
      success: true,
      txHash: data.txHash,
      vault: request.vault,
      amountDeposited: request.amount,
      sharesReceived: data.sharesReceived,
    }),
  };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.vault) {
    return { valid: false, reason: `vault is required. Options: ${VALID_VAULTS.join(", ")}` };
  }
  if (!VALID_VAULTS.includes(request.vault.toLowerCase())) {
    return {
      valid: false,
      reason: `Unknown vault: ${request.vault}. Options: ${VALID_VAULTS.join(", ")}`,
    };
  }
  if (!request.amount || parseFloat(request.amount) <= 0) {
    return { valid: false, reason: "amount must be a positive number" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Deposit ${request.amount} USDC into ${request.vault} vault`;
}
