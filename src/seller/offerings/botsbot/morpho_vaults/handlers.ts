import type { ExecuteJobResult } from "../../../runtime/offeringTypes.js";
import { apiPost } from "../api-client.js";

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const data = await apiPost("/api/v1/defi-yield", {
    token: request.token,
    protocol: "morpho",
  });
  return { deliverable: JSON.stringify(data) };
}

export function requestPayment(request: any): string {
  return request.token ? `Morpho vaults for ${request.token}` : "All Morpho vault opportunities";
}
