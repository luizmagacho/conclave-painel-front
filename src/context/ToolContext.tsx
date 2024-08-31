import {
  deleteTool,
  getAllNames,
  getAllResponsible,
  getTools,
  getToolsByCenterCostId,
  postTool,
  updateTool,
} from "@/services/tool";
import { Tool, ToolDTO } from "@/services/tool/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ToolContextProps {
  tools: Tool[];
  loading: boolean;
  totalElements: number;
  listNames: string[];
  listResponsible: string[];
  handleGetTools: (
    page?: number,
    name?: string,
    responsible?: string,
    centerCost?: string,
    bankBranchLocalBank?: string
  ) => Promise<void>;
  handleGetToolsByCenterCostId: (
    centerToolId: string,
    page?: number
  ) => Promise<void>;
  handlePostTool: (tool: ToolDTO) => Promise<void>;
  handleUpdateTool: (tool: Tool) => Promise<void>;
  handleDeleteTool: (toolId: string) => Promise<void>;
  handleGetAllNames: () => Promise<void>;
  handleGetAllResponsible: () => Promise<void>;
}

export const ToolContext = createContext({} as ToolContextProps);

export const ToolProvider = ({ children }: ProviderProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [bufferedTools, setBufferedTools] = useState<Tool[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const [listNames, setListNames] = useState<string[]>([]);
  const [listResponsible, setListResponsible] = useState<string[]>([]);

  const router = useRouter();

  async function handleGetTools(
    page: number = 0,
    name: string = "",
    responsible: string = "",
    centerCost: string = "",
    bankBranchLocalBank: string = ""
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getTools({
        page,
        size: 10,
        name,
        responsible,
        centerCost,
        bankBranchLocalBank,
      });
      setBufferedTools(content || []);
      setTools(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetToolsByCenterCostId(
    centerCostId: string,
    page: number = 0,
    name: string = "",
    responsible: string = ""
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getToolsByCenterCostId(
        centerCostId,
        { page, size: 15, name, responsible }
      );

      setBufferedTools(content || []);
      setTools(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostTool(tool: ToolDTO) {
    setLoading(true);

    try {
      const resp = await postTool(tool);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTool(tool: Tool) {
    setLoading(true);

    try {
      const resp = await updateTool(tool);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTool(toolId: string) {
    setLoading(true);

    try {
      await deleteTool(toolId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetAllNames() {
    try {
      setListNames(await getAllNames());
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetAllResponsible() {
    try {
      setListResponsible(await getAllResponsible());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ToolContext.Provider
      value={{
        tools,
        loading,
        totalElements,
        listNames,
        listResponsible,
        handleGetTools,
        handleGetToolsByCenterCostId,
        handlePostTool,
        handleUpdateTool,
        handleDeleteTool,
        handleGetAllNames,
        handleGetAllResponsible,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};
