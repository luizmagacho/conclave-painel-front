import { Pagination } from "@/types/pagination";
import http from "../http";
import {
  LoginDTO,
  User,
  UserChangePasswordRequest,
  UserPaginationParam,
  UserRequest,
  UserRequestDTO,
} from "./type";

const baseUrl = "/user";

export async function getUser({ email }: UserRequest) {
  let res = await http.get<User>(`${baseUrl}/${email}`);
  return res.data;
}

export async function getUserById(userId: string) {
  let res = await http.get<User>(`${baseUrl}/userId/${userId}`);
  return res.data;
}

export async function postUser(user: UserRequestDTO) {
  let res = await http.post(baseUrl, user);
  return res.data;
}

export async function getUsers({ page, size, name = "" }: UserPaginationParam) {
  let res = await http.get<Pagination<User>>(baseUrl, {
    params: {
      page,
      size,
      name,
    },
  });
  return res.data;
}

export async function updateUser(user: User) {
  let res = await http.put(baseUrl, user);
  return res.status;
}

export async function deleteUser(userId: string) {
  await http.delete(baseUrl);
}

export async function changePasswordUser(
  userChangePassword: UserChangePasswordRequest
) {
  let res = await http.post(`${baseUrl}/change-password`, userChangePassword);
  return res.status;
}
