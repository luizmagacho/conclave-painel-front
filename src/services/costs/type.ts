export type Cost = {
  id: string | null;
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  purchaseDateFormatted: string;
  paymentDeadline: string;
  paymentDeadlineFormatted: string;
  costType: string;
  costCategory: string;
  name: string;
  vendorName: string;
  workerValue: number;
  materialValue: number;
  inssValue: number;
  totalAmount: number;
  valueRemas: number;
  userId: string;
  enabled: boolean;
  additionalDetails: string;
  paymentStatus: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CostDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  paymentDeadline: string;
  costType: string;
  costCategory: string;
  name: string;
  vendorName: string;
  workerValue: number | null;
  materialValue: number | null;
  inssValue: number | null;
  totalAmount: number | null;
  valueRemas: number | null;
  userId: string;
  enabled: boolean;
  additionalDetails: string;
  paymentStatus: boolean;
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
