import { Pagination } from "@/types/pagination";
import http from "../http";
import {
  Construction,
  ConstructionDTO,
  ConstructionPaginationParam,
} from "./type";

const baseUrl = "/construction";

export async function getConstructions({
  page,
  size,
  name,
  type,
}: ConstructionPaginationParam) {
  let res = await http.get<Pagination<Construction>>(baseUrl, {
    params: {
      page,
      size,
      name,
      type,
    },
  });
  return res.data;
}

export async function getAllConstructions() {
  let res = await http.get<Construction[]>(`${baseUrl}/all`);
  return res.data;
}

export async function postConstruction(construction: ConstructionDTO) {
  let res = await http.post(baseUrl, construction);
  return res.status;
}

export async function updateConstruction(construction: Construction) {
  let res = await http.put(baseUrl, construction);
  return res.status;
}
