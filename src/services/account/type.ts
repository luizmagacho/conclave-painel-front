import { Payment } from "../payment/type";

export type AccountSimpleList = {
  id: number;
  name: string;
  financialInstitute: string;
  accountNumber: string;
  currency: string;
  balance: number;
  startBalance: number | null;
  minBalance: number | null;
  accountGroup: string;
  comment: string;
  favorite: boolean;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AccountDetails = {
  id: number;
  name: string;
  financialInstitute: string;
  accountNumber: string;
  currency: string;
  balance: number;
  startBalance: number;
  minBalance: number;
  accountGroup: string;
  comment: string;
  favorite: boolean;
  payments: Payment[];
};

export type AccountDTO = {
  name: string;
  financialInstitute: string;
  accountNumber: string;
  currency: string;
  balance: number;
  startBalance: number | null;
  minBalance: number | null;
  accountGroup: string;
  comment: string;
  favorite: boolean;
  enabled: boolean;
  payments: Payment[];
};

export type AccountPaginationParam = {
  size: number;
  page: number;
  name: string;
};
