import {
  deleteAccount,
  getAccountById,
  getAccounts,
  postAccount,
  updateAccount,
} from "@/services/account";
import {
  AccountDTO,
  AccountDetails,
  AccountSimpleList,
} from "@/services/account/type";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface AccountContextProps {
  accountsList: AccountSimpleList[];
  accountDetails: AccountDetails | null;
  loading: boolean;
  totalElements: number;
  handleGetAccounts: (
    page?: number,
    completeName?: string,
    type?: string
  ) => Promise<void>;
  handlePostAccount: (account: AccountDTO) => Promise<void>;
  handleGetAccountById: (accountId: string) => Promise<void>;
  handleUpdateAccount: (account: AccountDetails) => Promise<void>;
  handleDeleteAccount: (accountId: string) => Promise<void>;
}

export const AccountContext = createContext({} as AccountContextProps);

export const AccountProvider = ({ children }: ProviderProps) => {
  const [accountsList, setAccountsList] = useState<AccountSimpleList[]>([]);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );
  const [bufferedAccountsList, setBufferedAccountsList] = useState<
    AccountSimpleList[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  async function handleGetAccounts(page: number = 0, name: string = "") {
    setLoading(true);
    try {
      const { content, totalElements } = await getAccounts({
        page,
        size: 10,
        name,
      });
      setBufferedAccountsList(content || []);
      setAccountsList(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetAccountById(accountId: string) {
    setLoading(true);
    try {
      const accountDetails = await getAccountById(accountId);
      setAccountDetails(accountDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostAccount(account: AccountDTO) {
    setLoading(true);

    try {
      const resp = await postAccount(account);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateAccount(account: AccountDetails) {
    setLoading(true);

    try {
      const resp = await updateAccount(account);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount(accountId: string) {
    setLoading(true);

    try {
      const resp = await deleteAccount(accountId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accountsList,
        accountDetails,
        loading,
        totalElements,
        handleGetAccounts,
        handleGetAccountById,
        handlePostAccount,
        handleUpdateAccount,
        handleDeleteAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
