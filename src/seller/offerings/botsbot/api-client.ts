/**
 * Shared API client for BotBot offerings.
 * Calls the backend DeFi intelligence API.
 */

const API_BASE = process.env.BOTSBOT_API_URL || "";
const API_KEY = process.env.BOTSBOT_INTERNAL_KEY || "";

export async function apiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Internal-Key": API_KEY } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  if (!res.ok) return { success: false, httpStatus: res.status, ...data };
  return data;
}

export async function apiGet(path: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    headers: {
      ...(API_KEY ? { "X-Internal-Key": API_KEY } : {}),
    },
    signal: AbortSignal.timeout(30_000),
  });

  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  if (!res.ok) return { success: false, httpStatus: res.status, ...data };
  return data;
}

// Known token addresses on Base
export const TOKEN_ADDRESSES: Record<string, string> = {
  ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  WETH: "0x4200000000000000000000000000000000000006",
  DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  USDBC: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
  CBETH: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
  VIRTUAL: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
};

export function resolveTokenAddress(input: string): string | null {
  const bySymbol = TOKEN_ADDRESSES[input.toUpperCase()];
  if (bySymbol) return bySymbol;
  if (input.startsWith("0x") && input.length === 42) return input;
  return null;
}

export const SWAP_WALLET = process.env.ACP_WALLET_ADDRESS || "";
