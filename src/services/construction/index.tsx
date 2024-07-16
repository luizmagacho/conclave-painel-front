import { Pagination } from "@/types/pagination";
import http from "../http";
import {
  Construction,
  ConstructionDTO,
  ConstructionPaginationParam,
} from "./type";
import { getAPIClient } from "../axios";

const baseUrl = "/construction";
const api = getAPIClient();

export async function getConstructions({
  page,
  size,
  code,
  bankBranch,
}: ConstructionPaginationParam) {
  let res = await api.get<Pagination<Construction>>(baseUrl, {
    params: {
      page,
      size,
      code,
      bankBranch,
    },
  });
  return res.data;
}

export async function getConstructionsNotEnabled({
  page,
  size,
  code,
  bankBranch,
}: ConstructionPaginationParam) {
  let res = await api.get<Pagination<Construction>>(`${baseUrl}/disabled`, {
    params: {
      page,
      size,
      code,
      bankBranch,
    },
  });
  return res.data;
}

export async function getConstructionById(id: string) {
  let res = await api.get<Construction>(`${baseUrl}/${id}`);
  return res.data;
}

export async function getAllConstructions() {
  let res = await api.get<Construction[]>(`${baseUrl}/all`);
  return res.data;
}

export async function postConstruction(construction: ConstructionDTO) {
  let res = await api.post(baseUrl, construction);
  return res.status;
}

export async function updateConstruction(construction: Construction) {
  let res = await api.put(baseUrl, construction);
  return res.status;
}

export async function deleteConstruction(constructionId: string) {
  let res = await api.delete(`${baseUrl}/${constructionId}`);
  return res.status;
}

export async function reactiveConstruction(constructionId: string) {
  let res = await api.patch(`${baseUrl}/${constructionId}`);
  return res.status;
}
