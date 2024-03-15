import {
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  postSupplier,
  updateSupplier,
} from "@/services/supplier";
import { Supplier, SupplierDTO } from "@/services/supplier/type";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface ProviderProps {
  children: ReactNode;
}

interface SupplierContextProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  totalElements: number;
  handleGetSuppliers: (
    page?: number,
    completeName?: string,
    type?: string
  ) => Promise<void>;
  handlePostSupplier: (supplier: SupplierDTO) => Promise<void>;
  handleGetSupplierById: (supplierId: string) => Promise<void>;
  handleUpdateSupplier: (supplier: Supplier) => Promise<void>;
  handleDeleteSupplier: (supplierId: string) => Promise<void>;
}

export const SupplierContext = createContext({} as SupplierContextProps);

export const SupplierProvider = ({ children }: ProviderProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [bufferedSuppliers, setBufferedSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  async function handleGetSuppliers(
    page: number = 0,
    completeName: string = "",
    type = "Nome"
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getSuppliers({
        page,
        size: 10,
        completeName,
        type,
      });
      setBufferedSuppliers(content || []);
      setSuppliers(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetSupplierById(supplierId: string) {
    setLoading(true);
    try {
      const supplier = await getSupplierById(supplierId);
      await setSelectedSupplier(supplier);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostSupplier(supplier: SupplierDTO) {
    setLoading(true);

    try {
      const resp = await postSupplier(supplier);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateSupplier(supplier: Supplier) {
    setLoading(true);

    try {
      const resp = await updateSupplier(supplier);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSupplier(supplierId: string) {
    setLoading(true);

    try {
      const resp = await deleteSupplier(supplierId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetSuppliers();
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        selectedSupplier,
        loading,
        totalElements,
        handleGetSuppliers,
        handleGetSupplierById,
        handlePostSupplier,
        handleUpdateSupplier,
        handleDeleteSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
