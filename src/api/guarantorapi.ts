import type { Guarantor } from "@/types";

// Align base path with other API modules in this project
const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

export const getGuarantors = async (): Promise<Guarantor[]> => {
  const response = await fetch(`${API_BASE_URL}/get_master/guarantor`);
  if (!response.ok) {
    throw new Error("Failed to fetch guarantors");
  }
  return response.json();
};

export const createGuarantor = async (
  product: Omit<Guarantor, "id">
): Promise<Guarantor> => {
  const response = await fetch(`${API_BASE_URL}/create_master`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tablename: "guarantor", data: product }),
  });

  if (!response.ok) {
    throw new Error("Failed to create guarantor");
  }
  return response.json();
};

export const updateGuarantor = async (
  id: string,
  product: Omit<Guarantor, "id"> & { isActive: boolean }
): Promise<Guarantor> => {
  // Backend uses a generic update_master endpoint similar to create
  const response = await fetch(`${API_BASE_URL}/update_master/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tablename: "guarantor", id, data: product }),
  });

  if (!response.ok) {
    throw new Error("Failed to update guarantor");
  }
  return response.json();
};

export const deleteGuarantor = async (id: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/delete_master/${id}/guarantor`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tablename: "guarantor", id }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete guarantor");
  }
};

export const searchGuarantors = async (query: string): Promise<Guarantor[]> => {
  const response = await fetch(
    `${API_BASE_URL}/get_master/guarantor?search=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Failed to search guarantors");
  }
  return response.json();
};

// Lightweight wrapper to offer a consistent object-style API the UI expects.
// This mirrors the previously commented implementation but reuses the small
// helper functions above and relaxes typing to allow partial payloads.
export const guarantorApi = {
  getAll: async (): Promise<Guarantor[]> => {
    const data = await getGuarantors();
    // Some backends may wrap actual list inside data/result etc.
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.result)
      ? (data as any).result
      : [];
    return list as Guarantor[];
  },
  getById: async (id: string): Promise<Guarantor> => {
    const resp = await fetch(`${API_BASE_URL}/get_master/guarantor/${id}`);
    if (!resp.ok) throw new Error("Failed to fetch guarantor");
    return resp.json();
  },
  create: async (payload: Partial<Guarantor>): Promise<Guarantor> => {
    // Do not send id on create even if caller provided it manually.
    const { id: _omit, ...rest } = payload as any;
    return createGuarantor(rest as any);
  },
  update: async (
    id: string,
    payload: Partial<Guarantor>
  ): Promise<Guarantor> => {
    // Backend original helper expected an isActive flag; supply default true if missing.
    const { id: _omit, ...rest } = payload as any;
    try {
      return await updateGuarantor(id, { ...(rest as any), isActive: true });
    } catch (e) {
      // Fallback: try a more permissive request without isActive if first attempt failed.
      const resp = await fetch(`${API_BASE_URL}/update_master/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tablename: "guarantor", id, data: rest }),
      });
      if (!resp.ok)
        throw e instanceof Error ? e : new Error("Failed to update guarantor");
      return resp.json();
    }
  },
  delete: async (id: string): Promise<void> => deleteGuarantor(id),
  search: async (query: string): Promise<Guarantor[]> =>
    searchGuarantors(query),
};

// // services/guarantor-api.ts
// import { Guarantor, EmploymentInfo } from "@/types";

// const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

// export const guarantorApi = {
//   // Get all guarantors
//   getAll: async (): Promise<Guarantor[]> => {
//     const response = await fetch(`${API_BASE_URL}/get_master/guarantor`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch guarantors");
//     }
//     const data = await response.json();
//     // Normalize: backend may wrap in { data: [...] }
//     const list = Array.isArray(data)
//       ? data
//       : Array.isArray(data?.data)
//       ? data.data
//       : Array.isArray(data?.result)
//       ? data.result
//       : [];
//     return list as Guarantor[];
//   },

//   // Get a single guarantor by ID
//   getById: async (id: string): Promise<Guarantor> => {
//     const response = await fetch(`${API_BASE_URL}/get_master/guarantor/${id}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch guarantor");
//     }
//     return response.json();
//   },

//   // Create a new guarantor
//   create: async (guarantorData: Partial<Guarantor>): Promise<Guarantor> => {
//     const response = await fetch(`${API_BASE_URL}/create_master`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ tablename: "guarantor", data: guarantorData }),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to create guarantor");
//     }
//     const data = await response.json();
//     // Normalize: server may return { data: {...} } or basic message
//     const created = (
//       data && typeof data === "object" && "data" in data
//         ? (data as any).data
//         : data
//     ) as Partial<Guarantor>;
//     return created as Guarantor;
//   },

//   // Update an existing guarantor
//   update: async (
//     id: string,
//     guarantorData: Partial<Guarantor>
//   ): Promise<Guarantor> => {
//     const response = await fetch(`${API_BASE_URL}/update_master/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ tablename: "guarantor", id, data: guarantorData }),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to update guarantor");
//     }
//     return response.json();
//   },

//   // Delete a guarantor
//   delete: async (id: string): Promise<void> => {
//     if (!id) throw new Error("Missing guarantor id");

//     const encodedId = encodeURIComponent(id);
//     const attempts: Array<() => Promise<Response>> = [
//       // 1) DELETE without body (some servers reject DELETE bodies)
//       () =>
//         fetch(`${API_BASE_URL}/delete_master/${encodedId}/guarantor`, {
//           method: "DELETE",
//           headers: { Accept: "application/json" },
//         }),
//       // 2) DELETE with JSON body
//       () =>
//         fetch(`${API_BASE_URL}/delete_master/${encodedId}/guarantor`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({ tablename: "guarantor", id }),
//         }),
//       // 2b) DELETE with query param
//       () =>
//         fetch(
//           `${API_BASE_URL}/delete_master/${encodedId}/guarantor?id=${encodedId}`,
//           {
//             method: "DELETE",
//             headers: { Accept: "application/json" },
//           }
//         ),
//       // 3) POST to delete_master (some backends use POST for delete)
//       () =>
//         fetch(`${API_BASE_URL}/delete_master`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             tablename: "guarantor",
//             id,
//             action: "delete",
//           }),
//         }),
//       // 4) PUT update_master with delete action flag
//       () =>
//         fetch(`${API_BASE_URL}/update_master/${encodedId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             tablename: "guarantor",
//             id,
//             action: "delete",
//             status: "deleted",
//           }),
//         }),
//     ];

//     let lastResp: Response | null = null;
//     for (const run of attempts) {
//       try {
//         const resp = await run();
//         lastResp = resp;
//         if (resp.ok) return; // success
//       } catch (e) {
//         // try next
//       }
//     }

//     // If all attempts failed, surface the most informative error
//     if (lastResp) {
//       let details = "";
//       try {
//         const text = await lastResp.text();
//         if (text) {
//           try {
//             const json = JSON.parse(text);
//             details = json.message || text;
//           } catch {
//             details = text;
//           }
//         }
//       } catch {}
//       throw new Error(
//         `Failed to delete guarantor: ${lastResp.status} ${details || ""}`.trim()
//       );
//     }
//     throw new Error("Failed to delete guarantor: network error");
//   },

//   // Search guarantors
//   search: async (query: string): Promise<Guarantor[]> => {
//     const response = await fetch(
//       `${API_BASE_URL}/get_master/guarantor?search=${encodeURIComponent(query)}`
//     );
//     if (!response.ok) {
//       throw new Error("Failed to search guarantors");
//     }
//     return response.json();
//   },
// };
