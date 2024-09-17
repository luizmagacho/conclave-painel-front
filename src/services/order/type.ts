import { MaterialOrder, MaterialOrderDTO } from "../material/type";

export type Order = {
  id: string | null;
  materials: MaterialOrder[];
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  payer: string;
  typeCenterCost: string;

  userRequestId: string;
  userRequest: string;
  finish: boolean;
  orderDate: string;
  orderTime: string;
  orderDateFormatted: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type OrderDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranchLocalBank: string;
  payer: string;
  typeCenterCost: string;
  materials: MaterialOrderDTO[];
  userRequestId: string;
  finish: boolean;
  userRequest: string;
  orderDate: string;
  orderTime: string;
};

export type OrderPaginationParam = {
  size: number;
  page: number;
  centerCostId: string;
  orderDate: Date | null;
  finish: boolean;
};
