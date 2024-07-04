import {
  deletePurchase,
  getPurchases,
  postPurchase,
  updatePurchase,
} from "@/services/purchase";
import { Purchase, PurchaseDTO } from "@/services/purchase/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface PurchaseContextProps {
  purchases: Purchase[];
  loading: boolean;
  totalElements: number;
  handleGetPurchases: (page?: number) => Promise<void>;
  handlePostPurchase: (purchase: PurchaseDTO) => Promise<void>;
  handleUpdatePurchase: (purchase: Purchase) => void;
  handleDeletePurchase: (purchaseId: string) => Promise<void>;
}

export const PurchaseContext = createContext({} as PurchaseContextProps);

export const PurchaseProvider = ({ children }: ProviderProps) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [bufferedPurchases, setBufferedPurchases] = useState<Purchase[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const router = useRouter();

  async function handleGetPurchases(page: number = 0) {
    setLoading(true);
    try {
      const { content, totalElements } = await getPurchases({ page, size: 15 });

      setBufferedPurchases(content || []);
      setPurchases(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  async function handlePostPurchase(purchase: PurchaseDTO) {
    setLoading(true);

    try {
      const resp = await postPurchase(purchase);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePurchase(purchase: Purchase) {
    setLoading(true);

    try {
      const resp = await updatePurchase(purchase);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePurchase(purchaseId: string) {
    setLoading(true);
    try {
      const resp = await deletePurchase(purchaseId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetPurchases();
  }, []);

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        loading,
        totalElements,
        handleGetPurchases,
        handlePostPurchase,
        handleUpdatePurchase,
        handleDeletePurchase,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
