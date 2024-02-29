import { Pagination } from "@/types/pagination";
import { Material, MaterialDTO, MaterialPaginationParam } from "./type";
import { getAPIClient } from "../axios";

const baseUrl = "/material";
const api = getAPIClient();

export async function getMaterials({
  page,
  size,
  name,
  type,
}: MaterialPaginationParam) {
  let res = await api.get<Pagination<Material>>(baseUrl, {
    params: {
      page,
      size,
      name,
      type,
    },
  });
  return res.data;
}

export async function postMaterial(material: MaterialDTO) {
  let res = await api.post(baseUrl, material);
  return res.status;
}

export async function updateMaterial(material: Material) {
  let res = await api.put(baseUrl, material);
  return res.status;
}
