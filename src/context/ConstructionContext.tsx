import { getConstructions, postConstruction } from "@/services/construction";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ConstructionContextProps {
  constructions: Construction[];
  loading: boolean;
  totalElements: number;
  handleGetConstructions: (
    page?: number,
    name?: string,
    type?: string
  ) => Promise<void>;
  handlePostConstruction: (construction: ConstructionDTO) => Promise<void>;
}

export const ConstructionContext = createContext(
  {} as ConstructionContextProps
);

export const ConstructionProvider = ({ children }: ProviderProps) => {
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [bufferedConstructions, setBufferedConstructions] = useState<
    Construction[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const router = useRouter();

  async function handleGetConstructions(
    page: number = 0,
    name: string = "",
    type = "Nome"
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getConstructions({
        page,
        size: 10,
        name,
        type,
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

  useEffect(() => {
    handleGetConstructions();
  }, []);

  return (
    <ConstructionContext.Provider
      value={{
        constructions,
        loading,
        totalElements,
        handleGetConstructions,
        handlePostConstruction,
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};
