export type Cost = {
  id: string;
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  receiptDate: string;
  receiptDateFormatted: string;
  issueDate: string;
  issueDateFormatted: string;
  typeCenterCost: string;
  payer: string;
  workerValue: number;
  materialValue: number;
  inssValue: number;
  totalAmount: number;
  valueRemas: number;
  userId: string;
  enabled: boolean;
  invoice: string;
  numContract: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CostDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  receiptDate: string;
  issueDate: string;
  typeCenterCost: string;
  payer: string;
  workerValue: number | null;
  materialValue: number | null;
  inssValue: number | null;
  totalAmount: number | null;
  valueRemas: number | null;
  userId: string;
  invoice: string;
  numContract: string;
  enabled: boolean;
};

export type CostTotal = {
  totalWorkersValue: number;
  totalMaterialValue: number;
  totalInssValue: number;
  totalValue: number;
};

export type CostPaginationParam = {
  size: number;
  page: number;
  centerCost: string;
  month: string;
};
