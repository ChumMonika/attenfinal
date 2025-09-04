import { apiRequest } from "./api";

export async function login(uniqueId, password) {
  const response = await apiRequest("POST", "/api/login", { uniqueId, password });
  return response.json();
}

export async function logout() {
  await apiRequest("POST", "/api/logout");
}

export async function getCurrentUser() {
  const response = await apiRequest("GET", "/api/me");
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  return response.json();
}
