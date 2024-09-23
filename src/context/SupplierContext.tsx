import {
  deleteSupplier,
  getAllSuppliers,
  getAllSuppliersShortenedName,
  getSupplierById,
  getSuppliers,
  postSupplier,
  updateSupplier,
  validateCnpj,
  validateCpf,
  validateShortenedName,
} from "@/services/supplier";
import { Supplier, SupplierDTO } from "@/services/supplier/type";
import { Toast } from "primereact/toast";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface SupplierContextProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  allSuppliers: Supplier[];
  allSuppliersShortenedName: string[];
  loading: boolean;
  totalElements: number;
  postStatus: number;
  existsCpf: boolean;
  existsCnpj: boolean;
  existsShortenedName: boolean;
  handleGetSuppliers: (
    page?: number,
    completeName?: string,
    type?: string
  ) => Promise<void>;
  handleGetAllSuppliers: () => Promise<void>;
  handleGetAllShortenedName: () => Promise<void>;
  handlePostSupplier: (supplier: SupplierDTO) => Promise<number | null>;
  handleGetSupplierById: (supplierId: string) => Promise<void>;
  handleUpdateSupplier: (supplier: Supplier) => Promise<void>;
  handleDeleteSupplier: (supplierId: string) => Promise<void>;
  handleValidateCpf: (cpf: string) => Promise<void>;
  handleValidateCnpj: (cnpj: string) => Promise<void>;
  handleValidateShortenedName: (shortenedName: string) => Promise<void>;
}

export const SupplierContext = createContext({} as SupplierContextProps);

export const SupplierProvider = ({ children }: ProviderProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [existsCpf, setExistsCpf] = useState<boolean>(false);
  const [existsCnpj, setExistsCnpj] = useState<boolean>(false);
  const [existsShortenedName, setExistsShortenedName] =
    useState<boolean>(false);
  const [allSuppliers, setAllSuplliers] = useState<Supplier[]>([]);
  const [allSuppliersShortenedName, setAllSuplliersShortenedName] = useState<
    string[]
  >([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [bufferedSuppliers, setBufferedSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [postStatus, setPostStatus] = useState<number>(0);
  const toast = useRef<Toast>(null);

  async function handleGetSuppliers(
    page: number = 0,
    completeName: string = "",
    type = "Nome"
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getSuppliers({
        page,
        size: 15,
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

  async function handleGetAllSuppliers() {
    setLoading(true);
    try {
      setAllSuplliers(await getAllSuppliers());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetAllShortenedName() {
    setLoading(true);
    try {
      setAllSuplliersShortenedName(await getAllSuppliersShortenedName());
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
      if (resp === 201) {
        setPostStatus(resp);
        // ... Processar a resposta de sucesso ...

        toast.current?.show({
          // <-- Exibir a mensagem Toast
          severity: "success",
          summary: "Sucesso",
          detail: "Fornecedor criado com sucesso!",
          life: 3000,
        });
      }
      return resp;
    } catch (error) {
      console.error(error);
      return null;
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

  async function handleValidateCpf(cpf: string) {
    setExistsCpf(await validateCpf(cpf));
  }

  async function handleValidateCnpj(cnpj: string) {
    setExistsCnpj(await validateCnpj(cnpj));
  }

  async function handleValidateShortenedName(shortenedName: string) {
    setExistsShortenedName(await validateShortenedName(shortenedName));
  }

  useEffect(() => {
    handleGetSuppliers();
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        allSuppliers,
        allSuppliersShortenedName,
        selectedSupplier,
        loading,
        totalElements,
        postStatus,
        existsCpf,
        existsCnpj,
        existsShortenedName,
        handleGetSuppliers,
        handleGetAllSuppliers,
        handleGetAllShortenedName,
        handleGetSupplierById,
        handlePostSupplier,
        handleUpdateSupplier,
        handleDeleteSupplier,
        handleValidateCnpj,
        handleValidateCpf,
        handleValidateShortenedName,
      }}
    >
      <Toast ref={toast} />
      {children}
    </SupplierContext.Provider>
  );
};
