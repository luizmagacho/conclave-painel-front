import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import { CostPaginationParam, Tool, ToolDTO } from "./type";

const baseUrl = "/tool";
const api = getAPIClient();

export async function getTools({
  page,
  size,
  name,
  responsible,
}: CostPaginationParam) {
  let res = await api.get<Pagination<Tool>>(baseUrl, {
    params: {
      page,
      size,
      name,
      responsible,
    },
  });
  return res.data;
}
export async function getToolsByCenterCostId(
  centerCostId: string,
  { page, size, name, responsible }: CostPaginationParam
) {
  let res = await api.get<Pagination<Tool>>(
    `${baseUrl}/center-cost/${centerCostId}`,
    {
      params: {
        page,
        size,
        name,
        responsible,
      },
    }
  );
  return res.data;
}

export async function postTool(tool: ToolDTO) {
  let res = await api.post(baseUrl, tool);
  return res.status;
}

export async function updateTool(tool: Tool) {
  let res = await api.put(baseUrl, tool);
  return res.status;
}

export async function deleteTool(toolId: string) {
  let res = await api.delete(`${baseUrl}/${toolId}`);
  return res.status;
}
