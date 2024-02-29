import { Pagination } from "@/types/pagination";
import {
  LoginDTO,
  User,
  UserChangePasswordRequest,
  UserPaginationParam,
  UserRequest,
  UserRequestDTO,
} from "./type";
import { getAPIClient } from "../axios";

const baseUrl = "/user";
const api = getAPIClient();

export async function getUser({ email }: UserRequest) {
  let res = await api.get<User>(`${baseUrl}/${email}`);
  return res.data;
}

export async function getUserById(userId: string) {
  let res = await api.get<User>(`${baseUrl}/userId/${userId}`);
  return res.data;
}

export async function postUser(user: UserRequestDTO) {
  let res = await api.post(baseUrl, user);
  return res.data;
}

export async function getUsers({ page, size, name = "" }: UserPaginationParam) {
  let res = await api.get<Pagination<User>>(baseUrl, {
    params: {
      page,
      size,
      name,
    },
  });
  return res.data;
}

export async function updateUser(user: User) {
  let res = await api.put(baseUrl, user);
  return res.status;
}

export async function deleteUser(userId: string) {
  await api.delete(baseUrl);
}

export async function changePasswordUser(
  userChangePassword: UserChangePasswordRequest
) {
  let res = await api.post(`${baseUrl}/change-password`, userChangePassword);
  return res.status;
}
