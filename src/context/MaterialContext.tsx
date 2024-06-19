import {
  getAllMaterials,
  getMaterials,
  postMaterial,
  updateMaterial,
} from "@/services/material";
import { Material, MaterialDTO } from "@/services/material/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface MaterialContextProps {
  materials: Material[];
  allMaterials: Material[];
  loading: boolean;
  totalElements: number;
  handleGetMaterials: (
    page?: number,
    name?: string,
    type?: string
  ) => Promise<void>;
  handleGetAllMaterials: () => Promise<void>;
  handlePostMaterial: (material: MaterialDTO) => Promise<void>;
  handleUpdateMaterial: (material: Material) => Promise<void>;
}

export const MaterialContext = createContext({} as MaterialContextProps);

export const MaterialProvider = ({ children }: ProviderProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [bufferedMaterials, setBufferedMaterials] = useState<Material[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const router = useRouter();

  async function handleGetMaterials(
    page: number = 0,
    name: string = "",
    type = "Nome"
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getMaterials({
        page,
        size: 20,
        name,
        type,
      });
      setBufferedMaterials(content || []);
      setMaterials(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetAllMaterials() {
    setLoading(true);

    try {
      setAllMaterials(await getAllMaterials());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostMaterial(material: MaterialDTO) {
    setLoading(true);

    try {
      const resp = await postMaterial(material);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMaterial(material: Material) {
    setLoading(true);

    try {
      const resp = await updateMaterial(material);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetMaterials();
  }, []);

  return (
    <MaterialContext.Provider
      value={{
        materials,
        allMaterials,
        loading,
        totalElements,
        handleGetMaterials,
        handleGetAllMaterials,
        handlePostMaterial,
        handleUpdateMaterial,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};
