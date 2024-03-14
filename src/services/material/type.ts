export type Material = {
  id: number;
  name: string;
  quantity: string;
  metricUnit: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MaterialDTO = {
  name: string;
  quantity: string;
  metricUnit: string;
};

export type MaterialPaginationParam = {
  size: number;
  page: number;
  name: string;
  type: string;
};
