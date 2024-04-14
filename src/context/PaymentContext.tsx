import {
  deletePayment,
  getAllCategories,
  getAllSubCategories,
  getPayments,
  getPaymentsByAccountId,
  postCategory,
  postPayment,
  postSubCategory,
  updatePayment,
} from "@/services/payment";
import {
  Category,
  CategoryDTO,
  Payment,
  PaymentDTO,
  SearchType,
  SubCategory,
  SubCategoryDTO,
} from "@/services/payment/type";
import { ReactNode, createContext, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface PaymentContextProps {
  paymentsByAccountId: Payment[];
  allCategories: Category[];
  allSubCategories: SubCategory[];
  loading: boolean;
  totalElements: number;
  handleGetPayments: (page?: number) => Promise<void>;
  handleGetCategories: () => Promise<void>;
  handleGetSubCategories: () => Promise<void>;
  handleGetPaymentsByAccountId: (
    accountId: number,
    page?: number,
    searchType?: SearchType,
    centerCost?: number | null,
    beneficiary?: string,
    paymentDate?: Date,
    week?: number | null
  ) => Promise<void>;
  handlePostPayment: (payment: PaymentDTO) => Promise<void>;
  handlePostCategory: (category: CategoryDTO) => Promise<void>;
  handlePostSubCategory: (subCategory: SubCategoryDTO) => Promise<void>;
  handleUpdatePayment: (payment: Payment) => Promise<void>;
  handleDeletePayment: (paymentId: string) => Promise<void>;
}

export const PaymentContext = createContext({} as PaymentContextProps);

export const PaymentProvider = ({ children }: ProviderProps) => {
  const [paymentsByAccountId, setPaymentByAccountId] = useState<Payment[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<Category[]>([]);
  const [bufferedPaymentsByAccountId, setBufferedPaymentByAccountId] = useState<
    Payment[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  async function handleGetPayments(page: number = 0) {
    setLoading(true);
    try {
      const { content, totalElements } = await getPayments({
        page,
        size: 5,
      });
      setBufferedPaymentByAccountId(content || []);
      setPaymentByAccountId(content || []);
      console.log(content);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetCategories() {
    setLoading(true);
    try {
      setAllCategories(await getAllCategories());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      console.log(allCategories);
    }
  }

  async function handleGetSubCategories() {
    setLoading(true);
    try {
      setAllSubCategories(await getAllSubCategories());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetPaymentsByAccountId(
    accountId: number,
    page: number = 0,
    searchType: SearchType = SearchType.CENTERCOST,
    centerCost: number | null = null,
    beneficiary: string = "",
    paymentDate: Date = new Date(),
    week: number | null = null
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getPaymentsByAccountId(
        {
          page,
          size: 5,
          searchType,
          centerCost,
          beneficiary,
          paymentDate,
          week,
        },
        accountId
      );
      setBufferedPaymentByAccountId(content || []);
      setPaymentByAccountId(content || []);
      console.log(content);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostPayment(payment: PaymentDTO) {
    setLoading(true);
    try {
      const resp = await postPayment(payment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostCategory(category: CategoryDTO) {
    setLoading(true);
    try {
      const resp = await postCategory(category);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostSubCategory(subCategory: SubCategoryDTO) {
    setLoading(true);
    try {
      const resp = await postSubCategory(subCategory);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePayment(payment: Payment) {
    setLoading(true);
    try {
      const resp = await updatePayment(payment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  async function handleDeletePayment(paymentId: string) {
    setLoading(true);

    try {
      const resp = await deletePayment(paymentId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaymentContext.Provider
      value={{
        paymentsByAccountId,
        allCategories,
        allSubCategories,
        loading,
        totalElements,
        handleGetPayments,
        handleGetCategories,
        handleGetSubCategories,
        handleGetPaymentsByAccountId,
        handlePostPayment,
        handlePostCategory,
        handlePostSubCategory,
        handleUpdatePayment,
        handleDeletePayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
