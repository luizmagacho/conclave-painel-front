export type Construction = {
  id: number;
  code: number;
  bankBranch: number;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  openingDate: Date;
  closedDate: Date;
  userId: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ConstructionDTO = {
  code: number;
  bankBranch: number;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  openingDate: Date;
  closedDate: Date;
  userId: number;
  enabled: boolean;
};

export type ConstructionPaginationParam = {
  size: number;
  page: number;
  name: string;
  type: string;
};
