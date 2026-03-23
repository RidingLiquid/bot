import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";
import { apiPost, SWAP_WALLET } from "../api-client.js";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const VALID_VAULTS = ["aave", "gauntlet", "steakhouse", "moonwell", "avantis"];

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/internal/yield-withdraw", {
    vault: request.vault,
    amount: request.amount,
  });

  if (!data.success) {
    return {
      deliverable: JSON.stringify({
        success: false,
        error: data.error || "Withdrawal failed",
      }),
    };
  }

  return {
    deliverable: JSON.stringify({
      success: true,
      txHash: data.txHash,
      vault: request.vault,
      amountWithdrawn: data.amountWithdrawn,
    }),
    payableDetail: {
      tokenAddress: USDC_BASE,
      amount: parseFloat(data.amountWithdrawn || "0"),
    },
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
  if (!request.amount) {
    return { valid: false, reason: "amount is required (number or 'max')" };
  }
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Withdraw ${request.amount} shares from ${request.vault} vault`;
}
