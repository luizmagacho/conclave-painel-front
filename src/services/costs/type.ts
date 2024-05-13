export type Cost = {
  id: string | null;
  costCenter: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  purchaseDateFormatted: string;
  type: string;
  name: string;
  value: number;
  userId: string;
  enabled: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CostDTO = {
  name: string;
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  costType: string;
  value: number | null;
  valueRemas: number | null;
  userId: string;
  enabled?: boolean;
};

export type CostPaginationParam = {
  size: number;
  page: number;
};
