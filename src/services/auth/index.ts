import http from "../http";
import { LoginDTO, LoginResponseDTO, User } from "../user/type";
import { AuthRequest, AuthResponse } from "./types";

const baseUrl = "/auth/login";

export async function authenticate({ email }: AuthRequest) {
  let res = await http.post<AuthResponse>(baseUrl, email);
  return res.data;
}

export async function login(login: LoginDTO) {
  let res = await http.post<LoginResponseDTO>(`${baseUrl}`, login);
  console.log(login);
  return res.data;
}
