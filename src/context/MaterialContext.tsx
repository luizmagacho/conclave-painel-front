import { getMaterials, postMaterial } from "@/services/material";
import { Material, MaterialDTO } from "@/services/material/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface MaterialContextProps {
  materials: Material[];
  loading: boolean;
  totalElements: number;
  handleGetMaterials: (
    page?: number,
    name?: string,
    type?: string
  ) => Promise<void>;
  handlePostMaterial: (material: MaterialDTO) => Promise<void>;
}

export const MaterialContext = createContext({} as MaterialContextProps);

export const MaterialProvider = ({ children }: ProviderProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
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
        size: 10,
        name,
        type,
      });
      setBufferedMaterials(content || []);
      setMaterials(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.log(error);
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

  function logout() {
    Cookies.remove("portal.token");
    Cookies.remove("portal.username");
    window.localStorage.clear();
    window.sessionStorage.clear();
    router.push("/");
  }

  useEffect(() => {
    handleGetMaterials();
  }, []);

  return (
    <MaterialContext.Provider
      value={{
        materials,
        loading,
        totalElements,
        handleGetMaterials,
        handlePostMaterial,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};
