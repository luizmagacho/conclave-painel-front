export type Purchase = {
  id: string;
  centerCost: string;
  centerCostId: string;
  requestedDate: string;
  requestedDateFormatted: string;
  requestedTime: string;
  requestedTimeFormatted: string;
  type: string;
  material: MaterialPurchase[];

  userId: string;
  enabled: boolean;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PurchaseDTO = {
  centerCost: string;
  centerCostId: string;
  requestedDate: string;
  requestedTime: string;
  type: string;
  material: MaterialPurchaseDTO[];

  userId: string;
  enabled?: boolean;
};

export type MaterialPurchase = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  supplierPurchase: SupplierPurchase[];
};

export type MaterialPurchaseDTO = {
  name: string;
  quantity: number | null;
  unit: string;
  supplierPurchase: SupplierPurchaseDTO[];
};

export type SupplierPurchase = {
  id: string;
  shortenedName: string;

  unitValue: number | null;
  totalValue: number | null;
};

export type SupplierPurchaseDTO = {
  supplierId?: string;
  shortenedName: string;

  unitValue: number | null;
  totalValue: number | null;
};

export type PurchasePaginationParam = {
  size: number;
  page: number;
};
