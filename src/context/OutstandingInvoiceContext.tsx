import {
  deleteOutstandingInvoices,
  getOutstandingInvoices,
  postOutstandingInvoices,
  updateOutstandingInvoices,
} from "@/services/outstanding-invoices";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
} from "@/services/outstanding-invoices/type";
import { ReactNode, createContext, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface OutstandingInvoicesProps {
  outstandingInvoices: OutstandingInvoices[];
  loading: boolean;
  totalElements: number;
  handleGetOutstandingInvoices: (
    page?: number,
    centerCost?: string,
    localBranch?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string
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
}

export const OutstandingInvoicesContext = createContext(
  {} as OutstandingInvoicesProps
);

export const OutstandingInvoicesProvider = ({ children }: ProviderProps) => {
  const [outstandingInvoices, setOutstandingInvoices] = useState<
    OutstandingInvoices[]
  >([]);
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

  return (
    <OutstandingInvoicesContext.Provider
      value={{
        outstandingInvoices,
        loading,
        totalElements,
        handleGetOutstandingInvoices,
        handlePostOutstandingInvoices,
        handleUpdateOutstandingInvoices,
        handleDeleteOutstandingInvoices,
      }}
    >
      {children}
    </OutstandingInvoicesContext.Provider>
  );
};
