import { Pagination } from "@/types/pagination";
import { Profile, ProfileDTO, ProfilePaginationParam, Role } from "./type";
import { getAPIClient } from "../axios";

const baseUrl = "/profile";
const api = getAPIClient();

export async function getProfiles({
  page,
  size,
  name,
  type,
}: ProfilePaginationParam) {
  let res = await api.get<Pagination<Profile>>(baseUrl, {
    params: {
      page,
      size,
      name,
      type,
    },
  });
  return res.data;
}

export async function postProfile(profile: ProfileDTO) {
  let res = await api.post(baseUrl, profile);
  return res.status;
}

export async function updateProfile(profile: Profile) {
  let res = await api.put(baseUrl, profile);
  return res.status;
}

export async function getAllProfiles() {
  let res = await api.get<Profile[]>(`${baseUrl}/all`);
  return res.data;
}

export async function getRoles() {
  let res = await api.get<Role[]>(`${baseUrl}/roles`);
  return res.data;
}

export async function deleteProfile(profileId: string) {
  let res = await api.delete(`${baseUrl}/${profileId}`);
  return res.status;
}
