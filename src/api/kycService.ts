import type { KYC } from "@/types";

const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

// API response types
interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ApiKYC {
  _id: string;
  document: string;
  noOfCopy: number;
  mandatory: "yes" | "no";
  type?: "Original" | "Photo Copy";
  Type?: "original" | "Original" | "Photo Copy"; // Handle inconsistency
}

// Transform API response to frontend format
function transformKYC(apiKyc: ApiKYC): KYC {
  return {
    id: apiKyc._id,
    document: apiKyc.document,
    noOfCopy: apiKyc.noOfCopy,
    mandatory: apiKyc.mandatory,
    type:
      apiKyc.type ||
      (apiKyc.Type === "original" ? "Original" : apiKyc.Type) ||
      "Original",
  };
}

// Transform frontend format to API format
function transformToApiKYC(
  kycData: Omit<KYC, "id"> | Partial<KYC>
): Partial<ApiKYC> {
  const result: Partial<ApiKYC> = {
    document: kycData.document,
    noOfCopy: kycData.noOfCopy,
    mandatory: kycData.mandatory,
    type: kycData.type,
  };

  // Remove undefined values
  Object.keys(result).forEach((key) => {
    if (result[key as keyof typeof result] === undefined) {
      delete result[key as keyof typeof result];
    }
  });

  return result;
}

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

export const kycService = {
  getAll: async (): Promise<KYC[]> => {
    const response = await requestJson<ApiResponse<ApiKYC[]>>(
      `${API_BASE_URL}/get_master/kyc`
    );
    return response.data.map(transformKYC);
  },

  getById: async (_id: string): Promise<KYC> => {
    const response = await requestJson<ApiResponse<ApiKYC>>(
      `${API_BASE_URL}/get_master/kyc/${_id}`
    );
    return transformKYC(response.data);
  },

  create: async (data: Omit<KYC, "id">): Promise<KYC> => {
    const apiData = transformToApiKYC(data);
    const response = await requestJson<ApiResponse<ApiKYC>>(
      `${API_BASE_URL}/create_master`,
      {
        method: "POST",
        body: JSON.stringify({ tablename: "kyc", data: apiData }),
      }
    );
    return transformKYC(response.data);
  },

  update: async (id: string, data: Partial<KYC>): Promise<KYC> => {
    const apiData = transformToApiKYC(data);
    const response = await requestJson<ApiResponse<ApiKYC>>(
      `${API_BASE_URL}/update_master/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ tablename: "kyc", id: id, data: apiData }),
      }
    );
    return transformKYC(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await requestJson<void>(
      `${API_BASE_URL}/delete_master/${encodeURIComponent(id)}/kyc`,
      {
        method: "DELETE",
        body: JSON.stringify({ tablename: "kyc", id: id }),
      }
    );
  },
};

export type { KYC };
