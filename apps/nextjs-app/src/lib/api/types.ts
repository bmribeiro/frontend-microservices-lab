export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
};

export type AuthenticatedUser = User;

export type ApiProblem = {
  message?: string;
  error?: string;
  status?: number;
  path?: string;
  timestamp?: string;
};
