import type { LoanProduct } from "@/types";

// Align base path with other API modules in this project
const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

export const getLoanProducts = async (): Promise<LoanProduct[]> => {
  const response = await fetch(`${API_BASE_URL}/get_master/loanproduct`);
  if (!response.ok) {
    throw new Error("Failed to fetch loan products");
  }
  return response.json();
};

export const createLoanProduct = async (
  product: Omit<LoanProduct, "id">
): Promise<LoanProduct> => {
  const response = await fetch(`${API_BASE_URL}/create_master`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tablename: "loanproduct", data: product }),
  });

  if (!response.ok) {
    throw new Error("Failed to create loan product");
  }
  return response.json();
};

export const updateLoanProduct = async (
  id: string,
  product: Omit<LoanProduct, "id"> & { isActive: boolean }
): Promise<LoanProduct> => {
  // Backend uses a generic update_master endpoint similar to create
  const response = await fetch(`${API_BASE_URL}/update_master/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tablename: "loanproduct", id, data: product }),
  });

  if (!response.ok) {
    throw new Error("Failed to update loan product");
  }
  return response.json();
};

export const deleteLoanProduct = async (id: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/delete_master/${id}/loanproduct`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tablename: "loanproduct", id }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete loan product");
  }
};
