export type Payment = {
  id: string;
  numberCheckTransfer: string;
  paymentDate: Date;
  paymentDateFormatted: Date;
  weekOfTheYear: number;
  beneficiary: string;
  beneficiaryId: string;
  category: Category;
  subCategory: SubCategory;
  cleared: boolean;
  withdraw: number;
  deposit: number;
  balance: number;
  transactionType: string;
  accountId: string;
  description: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaymentDTO = {
  numberCheckTransfer: string;
  paymentDate: Date | null;
  beneficiary: string;
  beneficiaryId: string | null;
  category: string;
  categoryId: string | null;
  subCategory: string;
  subCategoryId: string | null;
  cleared: boolean;
  withdraw: number | null;
  deposit: number | null;
  balance: number | null;
  transactionType: string;
  description: string;
  accountId: string;
  accountIdTo: string | null;
  enabled: boolean;
};

export type PaymentPaginationParam = {
  size: number;
  page: number;
};

export type PaymentByAccountIdPaginationParam = {
  size: number;
  page: number;
  searchType: SearchType;
  transactionType: TransactionTypeEnum;
  centerCost?: number | null;
  beneficiary?: string;
  paymentDate?: string;
  weekOfTheYear?: number | null;
  paymentDateStart?: string;
  paymentDateEnd?: string;
};

export type Category = {
  id: string;
  name: string;
};

export type CategoryDTO = {
  name: string;
};

export type SubCategory = {
  id: string;
  name: string;
};

export type SubCategoryDTO = {
  name: string;
};

export enum SearchType {
  CENTERCOST = "CENTERCOST",
  BENEFICIARY = "BENEFICIARY",
  PERIODOFTIME = "PERIODOFTIME",
  DATE = "DATE",
  WEEK = "WEEK",
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
}

export enum TransactionTypeEnum {
  ALLOPTIONS = "ALLOPTIONS",
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
  TRANSFER = "TRANSFER",
  MONEYWITHDRAW = "MONEYWITHDRAW",
}

export type TransactionType = {
  name: string;
  transaction: string;
};

export type FrequencyType = {
  name: string;
  frequency: string;
};

export type Week = {
  weekName: string;
  number: number;
};
