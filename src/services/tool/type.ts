export type Tool = {
  id: string | null;
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  name: string;
  responsible: string;
  userId: string;
  dateLoanTo: string;
  dateLoanToFormatted: string;
  dateLoanFrom: string;
  dateLoanFromFormatted: string;
  enabled: boolean;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ToolDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  name: string;
  responsible: string;
  userId: string;
  dateLoanTo: string;
  dateLoanFrom: string;
  enabled?: boolean;
};

export type CostPaginationParam = {
  size: number;
  page: number;
  name: string;
  responsible: string;
};
