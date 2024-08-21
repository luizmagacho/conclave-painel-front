export type Purchase = {
  id: string;
  centerCost: string;
  centerCostId: string;
  purchaseDate: string;
  purchaseDateFormatted: string;
  requestedDate: string;
  requestedDateFormatted: string;
  type: string;
  material: string;
  quantity: number;
  unitValue: number;
  totalValue: number;

  userId: string;
  enabled: boolean;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PurchaseDTO = {
  centerCost: string;
  centerCostId: string;
  purchaseDate: string;
  requestedDate: string;
  type: string;
  material: string;
  quantity: number | null;
  unitValue: number | null;
  totalValue: number | null;

  userId: string;
  enabled?: boolean;
};

export type PurchasePaginationParam = {
  size: number;
  page: number;
};
