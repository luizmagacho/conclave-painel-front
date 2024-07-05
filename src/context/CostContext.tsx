import {
  deleteCost,
  getCosts,
  getCostsByCenterCostId,
  postCost,
  updateCost,
} from "@/services/costs";
import { Cost, CostDTO } from "@/services/costs/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface CostsContextProps {
  costs: Cost[];
  loading: boolean;
  totalElements: number;
  handleGetCosts: (
    page?: number,
    centerCost?: string,
    month?: string
  ) => Promise<void>;
  handleGetCostsByCenterCostId: (
    centerCostId: string,
    page?: number
  ) => Promise<void>;
  handlePostCost: (cost: CostDTO) => Promise<void>;
  handleUpdateCost: (cost: Cost) => Promise<void>;
  handleDeleteCost: (costId: string) => Promise<void>;
}

export const CostContext = createContext({} as CostsContextProps);

export const CostProvider = ({ children }: ProviderProps) => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [bufferedCosts, setBufferedCosts] = useState<Cost[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  async function handleGetCosts(
    page: number = 0,
    centerCost: string = "",
    month: string = ""
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getCosts({
        page,
        size: 15,
        centerCost,
        month,
      });

      setBufferedCosts(content || []);
      setCosts(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetCostsByCenterCostId(
    centerCostId: string,
    page: number = 0
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getCostsByCenterCostId(
        centerCostId,
        { page, size: 20, centerCost: "", month: "" }
      );

      setBufferedCosts(content || []);
      setCosts(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostCost(cost: CostDTO) {
    setLoading(true);

    try {
      const resp = await postCost(cost);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCost(cost: Cost) {
    setLoading(true);

    try {
      const resp = await updateCost(cost);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCost(costId: string) {
    setLoading(true);
    try {
      const resp = await deleteCost(costId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CostContext.Provider
      value={{
        costs,
        loading,
        totalElements,
        handleGetCosts,
        handleGetCostsByCenterCostId,
        handlePostCost,
        handleUpdateCost,
        handleDeleteCost,
      }}
    >
      {children}
    </CostContext.Provider>
  );
};
