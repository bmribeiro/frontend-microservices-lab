import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
