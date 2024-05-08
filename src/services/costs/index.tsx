import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import { Cost, CostDTO, CostPaginationParam } from "./type";

const baseUrl = "/cost";
const api = getAPIClient();

export async function getCosts({ page, size }: CostPaginationParam) {
  let res = await api.get<Pagination<Cost>>(baseUrl, {
    params: {
      page,
      size,
    },
  });
  return res.data;
}

export async function getCostsByCenterCostId(
  centerCostId: number,
  { page, size }: CostPaginationParam
) {
  let res = await api.get<Pagination<Cost>>(
    `${baseUrl}/center-cost/${centerCostId}`
  );
  return res.data;
}

export async function postCost(cost: CostDTO) {
  let res = await api.post(baseUrl, cost);
  return res.status;
}

export async function updateCost(cost: Cost) {
  let res = await api.put(baseUrl, cost);
  return res.status;
}

export async function deleteCost(costId: string) {
  let res = await api.delete(`${baseUrl}/${costId}`);
  return res.status;
}
