import {
  deleteConstruction,
  getConstructionById,
  getConstructions,
  getConstructionsNotEnabled,
  postConstruction,
  updateConstruction,
} from "@/services/construction";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ConstructionContextProps {
  constructions: Construction[];
  constructionsNotEnabled: Construction[];
  selectedConstruction: Construction | null;
  loading: boolean;
  totalElements: number;
  totalElementsNotEnabled: number;
  handleGetConstructions: (page?: number, code?: string) => Promise<void>;
  handleGetConstructionsNotEnabled: (
    page?: number,
    code?: string
  ) => Promise<void>;
  handleGetConstructionById: (id: string) => Promise<void>;
  handlePostConstruction: (construction: ConstructionDTO) => Promise<void>;
  handleUpdateConstruction: (construction: Construction) => Promise<void>;
  handleDeleteConstruction: (constructionId: string) => Promise<void>;
}

export const ConstructionContext = createContext(
  {} as ConstructionContextProps
);

export const ConstructionProvider = ({ children }: ProviderProps) => {
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [constructionsNotEnabled, setConstructionsNotEnabled] = useState<
    Construction[]
  >([]);
  const [bufferedConstructions, setBufferedConstructions] = useState<
    Construction[]
  >([]);
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalElementsNotEnabled, setTotalElementsNotEnabled] =
    useState<number>(0);

  const router = useRouter();

  async function handleGetConstructions(page: number = 0, code: string = "") {
    setLoading(true);

    try {
      const { content, totalElements } = await getConstructions({
        page,
        size: 10,
        code,
      });
      setBufferedConstructions(content || []);
      setConstructions(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetConstructionsNotEnabled(
    page: number = 0,
    code: string = ""
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getConstructionsNotEnabled({
        page,
        size: 10,
        code,
      });
      setConstructionsNotEnabled(content || []);
      setTotalElementsNotEnabled(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetConstructionById(id: string) {
    try {
      setSelectedConstruction(await getConstructionById(id));
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePostConstruction(construction: ConstructionDTO) {
    setLoading(true);

    try {
      const resp = await postConstruction(construction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateConstruction(construction: Construction) {
    setLoading(true);

    try {
      const resp = await updateConstruction(construction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConstruction(constructionId: string) {
    setLoading(true);

    try {
      const resp = await deleteConstruction(constructionId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetConstructions();
    handleGetConstructionsNotEnabled();
  }, []);

  return (
    <ConstructionContext.Provider
      value={{
        constructions,
        constructionsNotEnabled,
        selectedConstruction,
        loading,
        totalElements,
        totalElementsNotEnabled,
        handleGetConstructions,
        handleGetConstructionsNotEnabled,
        handleGetConstructionById,
        handlePostConstruction,
        handleUpdateConstruction,
        handleDeleteConstruction,
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};
