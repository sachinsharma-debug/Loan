import type { Company, Branch } from "@/types";

const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

// Small helper mirroring the style used in loanProductService.ts
async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...(options || {}),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// Company API calls
export const companyApi = {
  // Align with generic master endpoints pattern
  getCompanies: async (): Promise<Company[]> =>
    requestJson<Company[]>(`${API_BASE_URL}/get_master/company`),

  // Convenience helper to get only id and name list (handles wrapped responses)
  getCompanyNames: async (): Promise<
    Array<{ id: string; companyName: string }>
  > => {
    const raw = await companyApi.getCompanies();
    // Some endpoints return { data: [...] }
    const list: any[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
    return list.map((c: any) => ({
      id: (c?.id ?? c?._id ?? "").toString(),
      companyName: (
        c?.companyName ??
        c?.company_name ??
        c?.mailingName ??
        ""
      ).toString(),
    }));
  },

  getCompany: async (id: string): Promise<Company> =>
    requestJson<Company>(`${API_BASE_URL}/get_master/company/${id}`),

  createCompany: async (companyData: Omit<Company, "id">): Promise<Company> =>
    requestJson<Company>(`${API_BASE_URL}/create_master`, {
      method: "POST",
      body: JSON.stringify({ tablename: "company", data: companyData }),
    }),

  updateCompany: async (
    id: string,
    companyData: Partial<Company>
  ): Promise<Company> =>
    requestJson<Company>(`${API_BASE_URL}/update_master/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tablename: "company", id, data: companyData }),
    }),

  deleteCompany: async (id: string): Promise<void> => {
    await requestJson<void>(`${API_BASE_URL}/delete_master/${id}/company`, {
      method: "DELETE",
      body: JSON.stringify({ tablename: "company", id }),
    });
  },
};

// Branch API calls
export const branchApi = {
  getBranches: async (): Promise<Branch[]> =>
    requestJson<Branch[]>(`${API_BASE_URL}/get_master/branch`),

  getBranch: async (id: string): Promise<Branch> =>
    requestJson<Branch>(`${API_BASE_URL}/get_master/branch/${id}`),

  createBranch: async (branchData: Omit<Branch, "id">): Promise<Branch> =>
    requestJson<Branch>(`${API_BASE_URL}/create_master`, {
      method: "POST",
      body: JSON.stringify({ tablename: "branch", data: branchData }),
    }),

  updateBranch: async (
    id: string,
    branchData: Partial<Branch>
  ): Promise<Branch> =>
    requestJson<Branch>(`${API_BASE_URL}/update_master/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tablename: "branch", id, data: branchData }),
    }),

  deleteBranch: async (id: string): Promise<void> => {
    await requestJson<void>(`${API_BASE_URL}/delete_master/${id}/branch`, {
      method: "DELETE",
      body: JSON.stringify({ tablename: "branch", id }),
    });
  },
};
