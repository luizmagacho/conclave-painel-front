export type Material = {
  id: string;
  name: string;
  observation: string;
  unit: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MaterialOrder = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MaterialDTO = {
  name: string;
  observation: string;
  unit: string;
  enabled?: boolean;
};

export type MaterialOrderDTO = {
  name: string;
  quantity: number | null;
  unit: string;
  enabled?: boolean;
};

export type MaterialPaginationParam = {
  size: number;
  page: number;
  name: string;
  type: string;
};
