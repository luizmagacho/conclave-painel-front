export type Material = {
  id: string;
  name: string;
  quantity: number | null;
  metricUnit: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MaterialDTO = {
  name: string;
  quantity: number | null;
  metricUnit: string;
  enabled?: boolean;
};

export type MaterialPaginationParam = {
  size: number;
  page: number;
  name: string;
  type: string;
};
