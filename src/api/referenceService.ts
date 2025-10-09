import type { Reference } from "@/types";

const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

// Shared helper to make JSON requests and throw on non-2xx
async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...(options || {}),
  });
  if (!response.ok) {
    // Try to include server message if available
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

// Normalize list responses whether backend returns array or { data: [...] } or { result: [...] }
function normalizeList<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && Array.isArray(raw.data)) return raw.data as T[];
  if (raw && Array.isArray(raw.result)) return raw.result as T[];
  return [] as T[];
}

export const referenceService = {
  // List all references
  getAll: async (): Promise<Reference[]> =>
    requestJson<Reference[]>(`${API_BASE_URL}/get_master/reference`),

  // Get one reference by id
  getById: async (id: string): Promise<Reference> =>
    requestJson<Reference>(`${API_BASE_URL}/get_master/reference/${id}`),

  // Create a new reference
  create: async (data: Omit<Reference, "id">): Promise<Reference> =>
    requestJson<Reference>(`${API_BASE_URL}/create_master`, {
      method: "POST",
      body: JSON.stringify({ tablename: "reference", data }),
    }),

  // Update reference
  update: async (id: string, data: Partial<Reference>): Promise<Reference> =>
    requestJson<Reference>(`${API_BASE_URL}/update_master/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tablename: "reference", id, data }),
    }),

  // Delete reference
  delete: async (id: string): Promise<void> => {
    await requestJson<void>(`${API_BASE_URL}/delete_master/${id}/reference`, {
      method: "DELETE",
      body: JSON.stringify({ tablename: "reference", id }),
    });
  },

  // Optional: search
  search: async (query: string): Promise<Reference[]> =>
    requestJson<Reference[]>(
      `${API_BASE_URL}/get_master/reference?search=${encodeURIComponent(query)}`
    ),
};

export type { Reference };
