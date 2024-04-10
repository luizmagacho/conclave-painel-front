import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import {
  AccountDTO,
  AccountDetails,
  AccountSimpleList,
  AccountPaginationParam,
} from "./type";

const baseUrl = "/account";
const api = getAPIClient();

export async function getAccounts({
  page,
  size,
  name,
}: AccountPaginationParam) {
  let res = await api.get<Pagination<AccountSimpleList>>(baseUrl, {
    params: {
      page,
      size,
      name,
    },
  });
  return res.data;
}

export async function getAccountsByFavorite({
  page,
  size,
  name,
  favorite,
}: AccountPaginationParam) {
  let res = await api.get<Pagination<AccountSimpleList>>(
    `${baseUrl}/favorite`,
    {
      params: {
        page,
        size,
        name,
        favorite,
      },
    }
  );
  return res.data;
}

export async function getAccountById(accountId: string) {
  let res = await api.get<AccountDetails>(`${baseUrl}/${accountId}`);
  return res.data;
}

export async function getAllAccounts() {
  let res = await api.get<AccountSimpleList[]>(`${baseUrl}/all`);
  return res.data;
}

export async function postAccount(account: AccountDTO) {
  let res = await api.post(baseUrl, account);
  return res.status;
}

export async function updateAccount(account: AccountSimpleList) {
  let res = await api.put(baseUrl, account);
  return res.status;
}

export async function deleteAccount(accountId: number) {
  let resp = await api.delete(`${baseUrl}/${accountId}`);
  return resp.status;
}
