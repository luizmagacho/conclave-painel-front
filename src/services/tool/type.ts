export type Tool = {
  id: string;
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  payer: string;
  typeCenterCost: string;
  name: string;
  responsible: string;
  userId: string;
  dateLoanTo: string;
  dateLoanToFormatted: string;
  dateLoanFrom: string;
  dateLoanFromFormatted: string;
  enabled: boolean;
  isFinishedConstruction?: boolean;
  additionalDetails?: string;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ToolDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  payer: string;
  typeCenterCost: string;
  name: string;
  responsible: string;
  userId: string;
  dateLoanTo: string;
  dateLoanFrom: string;
  enabled?: boolean;
  additionalDetails?: string;
};

export type CostPaginationParam = {
  size: number;
  page: number;
  name: string;
  responsible: string;
  centerCost?: string;
  bankBranchLocalBank?: string;
};
