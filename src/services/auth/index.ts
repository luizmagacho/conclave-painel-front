import { getAPIClient } from "../axios";
import http from "../http";
import { LoginDTO, LoginResponseDTO, User } from "../user/type";
import { AuthRequest, AuthResponse } from "./types";

const baseUrl = "/auth";

const api = getAPIClient();

export async function authenticate({ email }: AuthRequest) {
  let res = await api.post<AuthResponse>(`${baseUrl}/login`, email);
  return res.data;
}

export async function login(login: LoginDTO) {
  let res = await api.post<LoginResponseDTO>(`${baseUrl}/login`, login);
  return res.data;
}

export async function statusToken({ token }: AuthResponse) {
  let res = await api.post<string>(`${baseUrl}/status/token`, token);
  return res.status;
}
