import axios from "axios";
import { User } from "@/types";

const API_BASE_URL = "https://api-finance.prudent360.in/api/api/v1";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_BASE_URL}/users_list`);
  return response.data;
};

export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${id}`);
};
