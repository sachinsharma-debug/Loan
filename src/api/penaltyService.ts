import type { Penalty } from "@/types";

const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
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

export const penaltyService = {
  getAll: async (): Promise<Penalty[]> =>
    requestJson<Penalty[]>(`${API_BASE_URL}/get_master/penalty`),

  getById: async (id: string): Promise<Penalty> =>
    requestJson<Penalty>(`${API_BASE_URL}/get_master/penalty/${id}`),

  create: async (data: Omit<Penalty, "id">): Promise<Penalty> =>
    requestJson<Penalty>(`${API_BASE_URL}/create_master`, {
      method: "POST",
      body: JSON.stringify({ tablename: "penalty", data }),
    }),

  update: async (id: string, data: Partial<Penalty>): Promise<Penalty> =>
    requestJson<Penalty>(`${API_BASE_URL}/update_master/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tablename: "penalty", id, data }),
    }),

  delete: async (id: string): Promise<void> => {
    await requestJson<void>(
      `${API_BASE_URL}/delete_master/${encodeURIComponent(id)}/penalty`,
      {
        method: "DELETE",
        body: JSON.stringify({ tablename: "penalty", id }),
      }
    );
  },
};

export type { Penalty };
