import { Payment } from "../payment/type";

export type AccountSimpleList = {
  id: number;
  name: string;
  favorite: boolean;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AccountDetails = {
  id: number;
  name: string;
  favorite: boolean;
  payments: Payment[];
};

export type AccountDTO = {
  name: string;
  favorite: boolean;
  payments: Payment[];
};

export type AccountPaginationParam = {
  size: number;
  page: number;
  name: string;
};
