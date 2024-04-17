export type Payment = {
  id: number;
  numberCheckTransfer: string;
  paymentDate: Date;
  paymentDateFormatted: Date;
  weekOfTheYear: number;
  beneficiary: string;
  beneficiaryId: number;
  category: Category;
  subCategory: SubCategory;
  cleared: boolean;
  withdraw: number;
  deposit: number;
  balance: number;
  accountId: number;
  description: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaymentDTO = {
  numberCheckTransfer: string;
  paymentDate: Date | null;
  beneficiary: string;
  beneficiaryId: number | null;
  category: string;
  categoryId: number | null;
  subCategory: string;
  subCategoryId: number | null;
  cleared: boolean;
  withdraw: number | null;
  deposit: number | null;
  balance: number | null;
  description: string;
  accountId: number;
  accountIdTo: number | null;
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
  centerCost?: number | null;
  beneficiary?: string;
  paymentDate?: Date;
  week?: number | null;
};

export type Category = {
  id: number;
  name: string;
};

export type CategoryDTO = {
  name: string;
};

export type SubCategory = {
  id: number;
  name: string;
};

export type SubCategoryDTO = {
  name: string;
};

export enum SearchType {
  CENTERCOST = "CENTERCOST",
  BENEFICIARY = "FavoBENEFICIARYrecido",
  PERIODOFTIME = "PERIODOFTIME",
  DATE = "DATE",
  WEEK = "WEEK",
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
}
