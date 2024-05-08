export type Cost = {
  id: number | null;
  costCenter: string;
  bankBranch: string;
  local: string;
  purchaseDate: string;
  costType: string;
  userId: number;
  enabled: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CostDTO = {
  costCenter: string;
  bankBranch: string;
  local: string;
  purchaseDate: string;
  costType: string;
  userId: number;
  enabled?: boolean;
};

export type CostPaginationParam = {
  size: number;
  page: number;
};
