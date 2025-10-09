import type { Penalty } from "@/types";
import { gettoken } from "./config";
const API_BASE_URL = "http://localhost:3000/api/v1";

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
    
          "Content-Type": "application/json",
          "Authorization": `Bearer ${gettoken()}`
        ,
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
        headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${gettoken()}`
            },
        body: JSON.stringify({ tablename: "penalty", id }),
      }
    );
  },
};

export type { Penalty };
