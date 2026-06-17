export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
}

export interface AuthUser {
  id?: number;
  username: string;
  roles?: string[];
}

export interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role?: string;
}
