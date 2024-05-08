import {
  deletePayment,
  getAllCategories,
  getAllFrequency,
  getAllSubCategories,
  getAllTransactions,
  getAllWeekOfTheYear,
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
  FrequencyType,
  Payment,
  PaymentDTO,
  SearchType,
  SubCategory,
  SubCategoryDTO,
  TransactionType,
  TransactionTypeEnum,
  Week,
} from "@/services/payment/type";
import { ReactNode, createContext, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface PaymentContextProps {
  paymentsByAccountId: Payment[];
  allCategories: Category[];
  allSubCategories: SubCategory[];
  transactionsTypes: TransactionType[];
  frequencyTypes: FrequencyType[];
  weeksOfTheYear: Week[];
  loading: boolean;
  totalElements: number;
  handleGetPayments: (page?: number) => Promise<void>;
  handleGetCategories: () => Promise<void>;
  handleGetSubCategories: () => Promise<void>;
  handleGetTransactionTypes: () => Promise<void>;
  handleGetFrequencyTypes: () => Promise<void>;
  handleGetWeeksOfTheYear: (year: number) => Promise<void>;
  handleGetPaymentsByAccountId: (
    accountId: number,
    page?: number,
    searchType?: SearchType,
    transactionType?: TransactionTypeEnum,
    centerCost?: number | null,
    beneficiary?: string,
    paymentDate?: string,
    weekOfTheYear?: number | null,
    paymentDateStart?: string,
    paymentDateEnd?: string
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
  const [transactionsTypes, setTransactionsTypes] = useState<TransactionType[]>(
    []
  );
  const [weeksOfTheYear, setWeeksOfTheYear] = useState<Week[]>([]);
  const [frequencyTypes, setFrequencyTypes] = useState<FrequencyType[]>([]);
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
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetCategories() {
    try {
      setAllCategories(await getAllCategories());
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handleGetSubCategories() {
    try {
      setAllSubCategories(await getAllSubCategories());
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handleGetTransactionTypes() {
    try {
      setTransactionsTypes(await getAllTransactions());
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handleGetWeeksOfTheYear(year: number) {
    try {
      setWeeksOfTheYear(await getAllWeekOfTheYear(year));
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handleGetFrequencyTypes() {
    try {
      setFrequencyTypes(await getAllFrequency());
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handleGetPaymentsByAccountId(
    accountId: number,
    page: number = 0,
    searchType: SearchType = SearchType.CENTERCOST,
    transactionType: TransactionTypeEnum = TransactionTypeEnum.ALLOPTIONS,
    centerCost: number | null = null,
    beneficiary: string = "",
    paymentDate: string = "",
    weekOfTheYear: number | null = null,
    paymentDateStart: string = "",
    paymentDateEnd: string = ""
  ) {
    setLoading(true);
    try {
      const { content, totalElements } = await getPaymentsByAccountId(
        {
          page,
          size: 10,
          searchType,
          transactionType,
          centerCost,
          beneficiary,
          paymentDate,
          weekOfTheYear,
          paymentDateStart,
          paymentDateEnd,
        },
        accountId
      );
      setBufferedPaymentByAccountId(content || []);
      setPaymentByAccountId(content || []);
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
    try {
      const resp = await postCategory(category);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function handlePostSubCategory(subCategory: SubCategoryDTO) {
    try {
      const resp = await postSubCategory(subCategory);
    } catch (error) {
      console.error(error);
    } finally {
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
        transactionsTypes,
        frequencyTypes,
        weeksOfTheYear,
        loading,
        totalElements,
        handleGetPayments,
        handleGetCategories,
        handleGetSubCategories,
        handleGetTransactionTypes,
        handleGetFrequencyTypes,
        handleGetWeeksOfTheYear,
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
