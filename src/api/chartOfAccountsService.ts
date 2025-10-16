import { gettoken } from "./config";

const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

export interface ChartAccount {
  _id?: string;
  id?: string;
  accountName: string;
  AccountType?: string;
  isActive?: boolean;
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gettoken()}`,
      ...(options?.headers || {}),
    },
    ...(options || {}),
  });
  if (!response.ok) {
    let details = "";
    try {
      const text = await response.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          details = (json && (json.message || json.error)) || text;
        } catch {
          details = text;
        }
      }
    } catch {}
    throw new Error(`Request failed: ${response.status} ${details}`.trim());
  }
  return response.json();
}

export const chartOfAccountsService = {
  getAll: async (): Promise<ChartAccount[]> => {
    const res = await requestJson<{
      data?: ChartAccount[];
      Data?: ChartAccount[];
    }>(`${API_BASE_URL}/getallchartsofaccountdata`);
    // Some APIs return data in either data or Data
    const list = (res?.data || (res as any)?.Data || []) as ChartAccount[];
    return Array.isArray(list) ? list : [];
  },
};

export type { ChartAccount as ChartOfAccount };
