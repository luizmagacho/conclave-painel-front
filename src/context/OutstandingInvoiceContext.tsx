import {
  deleteOutstandingInvoices,
  getAllCategories,
  getOutstandingInvoices,
  getOutstandingInvoicesByCenterCostId,
  postOutstandingInvoices,
  updateOutstandingInvoices,
} from "@/services/outstanding-invoices";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
} from "@/services/outstanding-invoices/type";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface OutstandingInvoicesProps {
  outstandingInvoices: OutstandingInvoices[];
  loading: boolean;
  totalElements: number;
  allCategories: string[];
  handleGetOutstandingInvoices: (
    page?: number,
    centerCost?: string,
    localBranch?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string
  ) => Promise<void>;
  handleGetOutstandingInvoicesByCenterCostId: (
    centerCostId: string,
    page?: number
  ) => Promise<void>;
  handlePostOutstandingInvoices: (
    outstandingInvoices: OutstandingInvoicesDTO
  ) => Promise<void>;
  handleUpdateOutstandingInvoices: (
    outstandingInvoices: OutstandingInvoices
  ) => Promise<void>;
  handleDeleteOutstandingInvoices: (
    outstandingInvoicesId: string
  ) => Promise<void>;
  handleGetAllCategories: () => Promise<void>;
}

export const OutstandingInvoicesContext = createContext(
  {} as OutstandingInvoicesProps
);

export const OutstandingInvoicesProvider = ({ children }: ProviderProps) => {
  const [outstandingInvoices, setOutstandingInvoices] = useState<
    OutstandingInvoices[]
  >([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [bufferedOutstandingInvoices, setBufferedOutstandingInvoices] =
    useState<OutstandingInvoices[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  async function handleGetOutstandingInvoices(
    page: number = 0,
    centerCost?: string,
    localBank?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getOutstandingInvoices({
        page,
        size: 15,
        centerCost,
        localBank,
        vendorName,
        paymentDeadlineFrom,
        paymentDeadlineTo,
      });
      setBufferedOutstandingInvoices(content || []);
      setOutstandingInvoices(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetOutstandingInvoicesByCenterCostId(
    centerCostId: string,
    page: number = 0
  ) {
    setLoading(true);
    try {
      const { content, totalElements } =
        await getOutstandingInvoicesByCenterCostId(centerCostId, {
          page,
          size: 20,
        });

      setBufferedOutstandingInvoices(content || []);
      setOutstandingInvoices(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostOutstandingInvoices(
    outstandingInvoices: OutstandingInvoicesDTO
  ) {
    setLoading(true);

    try {
      const resp = await postOutstandingInvoices(outstandingInvoices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoices
  ) {
    setLoading(true);

    try {
      const resp = await updateOutstandingInvoices(outstandingInvoices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOutstandingInvoices(
    outstandingInvoicesId: string
  ) {
    setLoading(true);
    try {
      const resp = await deleteOutstandingInvoices(outstandingInvoicesId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetAllCategories() {
    setLoading(true);
    try {
      setAllCategories(await getAllCategories());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetAllCategories();
  }, []);

  return (
    <OutstandingInvoicesContext.Provider
      value={{
        outstandingInvoices,
        allCategories,
        loading,
        totalElements,
        handleGetOutstandingInvoices,
        handleGetOutstandingInvoicesByCenterCostId,
        handlePostOutstandingInvoices,
        handleUpdateOutstandingInvoices,
        handleDeleteOutstandingInvoices,
        handleGetAllCategories,
      }}
    >
      {children}
    </OutstandingInvoicesContext.Provider>
  );
};
