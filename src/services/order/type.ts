import { Construction, ConstructionDTO } from "../construction/type";
import { Material, MaterialDTO } from "../material/type";

export type Order = {
  id: string | null;
  materials: Material[];
  construction: Construction;
  userRequestId: string;
  userRequest: string;
  finish: boolean;
  orderDate: Date;
  orderDateFormatted: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type OrderDTO = {
  construction: ConstructionDTO | undefined;
  materials: MaterialDTO[];
  userRequestId: string;
  finish: boolean;
  userRequest: string;
  orderDate: Date;
};

export type OrderPaginationParam = {
  size: number;
  page: number;
  constructionCode: string;
  orderDate: Date | null;
  finish: boolean;
};
