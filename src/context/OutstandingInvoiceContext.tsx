import {
  deleteOutstandingInvoices,
  getAdditionalDetailsFromVendor,
  getAllCategories,
  getOutstandingInvoices,
  getOutstandingInvoicesByCenterCostId,
  getOutstandingInvoicesToExport,
  postOutstandingInvoices,
  sumTotalValueByFilters,
  updateOutstandingInvoices,
} from "@/services/outstanding-invoices";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
  OutstandingInvoicesVendorExport,
} from "@/services/outstanding-invoices/type";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface OutstandingInvoicesProps {
  outstandingInvoices: OutstandingInvoices[];
  outstandingInvoicesVendorExport: OutstandingInvoicesVendorExport[];
  loading: boolean;
  totalElements: number;
  latestAdditionalDetails: string;
  allCategories: string[];
  sumTotalValue: number;
  handleGetOutstandingInvoices: (
    page?: number,
    centerCost?: string,
    localBranch?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) => Promise<void>;
  handleGetOutstandingInvoicesByCenterCostId: (
    centerCostId: string,
    page?: number,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) => Promise<void>;
  handleGetOutstandingInvoicesToExport: (
    page?: number,
    centerCost?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
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
  handleGetLatestAdditionalDetails: (vendorName: string) => Promise<void>;
  handleGetAllCategories: () => Promise<void>;
  handleSumTotalValueByFilter: (
    centerCost?: string,
    localBranch?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) => Promise<void>;
}

export const OutstandingInvoicesContext = createContext(
  {} as OutstandingInvoicesProps
);

export const OutstandingInvoicesProvider = ({ children }: ProviderProps) => {
  const [outstandingInvoices, setOutstandingInvoices] = useState<
    OutstandingInvoices[]
  >([]);
  const [outstandingInvoicesVendorExport, setOutstandingInvoicesVendorExport] =
    useState<OutstandingInvoicesVendorExport[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [bufferedOutstandingInvoices, setBufferedOutstandingInvoices] =
    useState<OutstandingInvoices[]>([]);

  const [latestAdditionalDetails, setLatestAdditionalDetails] =
    useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const [sumTotalValue, setSumTotalValue] = useState<number>(0);

  async function handleGetOutstandingInvoices(
    page: number = 0,
    centerCost?: string,
    localBank?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getOutstandingInvoices({
        page,
        size: 10,
        centerCost,
        localBank,
        vendorName,
        paymentDeadlineFrom,
        paymentDeadlineTo,
        additionalDetails,
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
    page: number = 0,
    centerCost?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) {
    setLoading(true);
    try {
      const { content, totalElements } =
        await getOutstandingInvoicesByCenterCostId(centerCostId, {
          page,
          size: 10,
          centerCost,
          paymentDeadlineFrom,
          paymentDeadlineTo,
          additionalDetails,
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

  async function handleGetOutstandingInvoicesToExport(
    page: number = 0,
    centerCost?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) {
    setLoading(true);
    try {
      setOutstandingInvoicesVendorExport(
        await getOutstandingInvoicesToExport({
          page,
          size: 15,
          centerCost,
          vendorName,
          paymentDeadlineFrom,
          paymentDeadlineTo,
          additionalDetails,
        })
      );
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

  async function handleGetLatestAdditionalDetails(vendorName: string) {
    setLoading(true);
    try {
      setLatestAdditionalDetails(
        await getAdditionalDetailsFromVendor(vendorName)
      );
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

  async function handleSumTotalValueByFilter(
    centerCost?: string,
    localBank?: string,
    vendorName?: string,
    paymentDeadlineFrom?: string,
    paymentDeadlineTo?: string,
    additionalDetails?: string
  ) {
    setLoading(true);
    try {
      setSumTotalValue(
        await sumTotalValueByFilters({
          centerCost,
          localBank,
          vendorName,
          paymentDeadlineFrom,
          paymentDeadlineTo,
          additionalDetails,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetAllCategories();
    handleGetLatestAdditionalDetails("");
    handleSumTotalValueByFilter();
  }, []);

  return (
    <OutstandingInvoicesContext.Provider
      value={{
        outstandingInvoices,
        outstandingInvoicesVendorExport,
        latestAdditionalDetails,
        allCategories,
        loading,
        totalElements,
        sumTotalValue,
        handleGetOutstandingInvoices,
        handleGetOutstandingInvoicesByCenterCostId,
        handleGetOutstandingInvoicesToExport,
        handlePostOutstandingInvoices,
        handleUpdateOutstandingInvoices,
        handleDeleteOutstandingInvoices,
        handleGetLatestAdditionalDetails,
        handleGetAllCategories,
        handleSumTotalValueByFilter,
      }}
    >
      {children}
    </OutstandingInvoicesContext.Provider>
  );
};
