// src/api/objectiveOfLoanApi.ts
import { ObjectiveOfLoan } from "@/types";

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

export const objectiveOfLoanApi = {
  getAll: async (): Promise<ObjectiveOfLoan[]> =>
    requestJson<ObjectiveOfLoan[]>(
      `${API_BASE_URL}/get_master/ObjectiveOfLoan`
    ),

  getById: async (id: string): Promise<ObjectiveOfLoan> =>
    requestJson<ObjectiveOfLoan>(
      `${API_BASE_URL}/get_master/ObjectiveOfLoan/${id}`
    ),

  create: async (data: Omit<ObjectiveOfLoan, "id">): Promise<ObjectiveOfLoan> =>
    requestJson<ObjectiveOfLoan>(`${API_BASE_URL}/create_master`, {
      method: "POST",
      body: JSON.stringify({ tablename: "ObjectiveOfLoan", data }),
    }),

  update: async (
    id: string,
    data: Partial<ObjectiveOfLoan>
  ): Promise<ObjectiveOfLoan> =>
    requestJson<ObjectiveOfLoan>(`${API_BASE_URL}/update_master/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tablename: "ObjectiveOfLoan", id, data }),
    }),

  delete: async (id: string): Promise<void> => {
    await requestJson<void>(
      `${API_BASE_URL}/delete_master/${encodeURIComponent(id)}/ObjectiveOfLoan`,
      {
        method: "DELETE",
        body: JSON.stringify({ tablename: "ObjectiveOfLoan", id }),
      }
    );
  },
};
