import {
  deleteTool,
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
}

export const ToolContext = createContext({} as ToolContextProps);

export const ToolProvider = ({ children }: ProviderProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [bufferedTools, setBufferedTools] = useState<Tool[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

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
        size: 15,
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

  return (
    <ToolContext.Provider
      value={{
        tools,
        loading,
        totalElements,
        handleGetTools,
        handleGetToolsByCenterCostId,
        handlePostTool,
        handleUpdateTool,
        handleDeleteTool,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};
