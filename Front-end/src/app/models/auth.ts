export interface RegisterRequest {
  rut: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  id: number;
}