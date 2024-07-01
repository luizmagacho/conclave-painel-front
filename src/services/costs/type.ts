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
  totalAmount: number;
  value: number;
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
  totalAmount: number | null;
  value: number | null;
  valueRemas: number | null;
  userId: string;
  enabled?: boolean;
  paymentStatus: boolean;
  additionalDetails: string;
};

export type CostPaginationParam = {
  size: number;
  page: number;
};
