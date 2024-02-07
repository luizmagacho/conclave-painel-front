import { Pagination } from "@/types/pagination";
import http from "../http";
import { Profile, ProfileDTO, ProfilePaginationParam, Role } from "./type";

const baseUrl = "/profile";

export async function getProfiles({
  page,
  size,
  name,
  role = "",
}: ProfilePaginationParam) {
  let res = await http.get<Pagination<Profile>>(baseUrl, {
    params: {
      page,
      size,
      name,
      role,
    },
  });
  return res.data;
}

export async function postProfile(profile: ProfileDTO) {
  let res = await http.post(baseUrl, profile);
  return res.status;
}

export async function updateProfile(profile: Profile) {
  let res = await http.put(baseUrl, profile);
  return res.status;
}

export async function getRoles() {
  let res = await http.get<Role[]>(`${baseUrl}/roles`);
  return res.data;
}

export async function deleteProfile(profileId: string) {
  let res = await http.delete(`${baseUrl}/${profileId}`);
  return res.status;
}
