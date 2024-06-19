import {
  deleteAccount,
  getAccountById,
  getAccounts,
  getAccountsByFavorite,
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
  accountsFavoriteList: AccountSimpleList[];
  accountsListNotFavorites: AccountSimpleList[];
  accountDetails: AccountDetails | null;
  loading: boolean;
  totalElements: number;
  handleGetAccounts: (
    page?: number,
    completeName?: string,
    type?: string
  ) => Promise<void>;
  handleGetAccountsByFavorite: (
    page?: number,
    completeName?: string,
    favorite?: boolean,
    type?: string
  ) => Promise<void>;
  handlePostAccount: (account: AccountDTO) => Promise<void>;
  handleGetAccountById: (accountId: string) => Promise<void>;
  handleUpdateAccount: (account: AccountSimpleList) => Promise<void>;
  handleDeleteAccount: (accountId: string) => Promise<void>;
}

export const AccountContext = createContext({} as AccountContextProps);

export const AccountProvider = ({ children }: ProviderProps) => {
  const [accountsList, setAccountsList] = useState<AccountSimpleList[]>([]);
  const [accountsFavoriteList, setAccountsFavoriteList] = useState<
    AccountSimpleList[]
  >([]);
  const [accountsListNotFavorites, setAccountsListNotFavorites] = useState<
    AccountSimpleList[]
  >([]);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );
  const [bufferedAccountsList, setBufferedAccountsList] = useState<
    AccountSimpleList[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalElementsNotFavorites, setTotalElementsNotFavorites] =
    useState<number>(0);

  async function handleGetAccounts(page: number = 0, name: string = "") {
    setLoading(true);
    try {
      const { content, totalElements } = await getAccounts({
        page,
        size: 20,
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

  async function handleGetAccountsByFavorite(
    page: number = 0,
    name: string = "",
    favorite: boolean = true
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getAccountsByFavorite({
        page,
        size: 20,
        name,
        favorite,
      });
      if (favorite) {
        setBufferedAccountsList(content || []);
        setAccountsFavoriteList(content || []);
        setTotalElements(totalElements);
      } else {
        setAccountsListNotFavorites(content || []);
        setTotalElementsNotFavorites(totalElements);
      }
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

  async function handleUpdateAccount(account: AccountSimpleList) {
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
        accountsFavoriteList,
        accountsListNotFavorites,
        accountDetails,
        loading,
        totalElements,
        handleGetAccounts,
        handleGetAccountsByFavorite,
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
