import http from "../http";
import { LoginDTO, LoginResponseDTO, User } from "../user/type";
import { AuthRequest, AuthResponse } from "./types";

const baseUrl = "/auth";

export async function authenticate({ email }: AuthRequest) {
  let res = await http.post<AuthResponse>(`${baseUrl}/login`, email);
  return res.data;
}

export async function login(login: LoginDTO) {
  let res = await http.post<LoginResponseDTO>(`${baseUrl}/login`, login);
  return res.data;
}

export async function statusToken({ token }: AuthResponse) {
  let res = await http.post<string>(`${baseUrl}/status/token`, token);
  return res.status;
}
