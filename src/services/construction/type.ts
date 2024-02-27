export type Construction = {
  id: number | null;
  code: number | null;
  bankBranch: number | null;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  openingDate: string;
  openingDateFormatted?: string;
  closedDate: string;
  closedDateFormatted?: string;
  userId: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ConstructionDTO = {
  code: number | null;
  bankBranch: number | null;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  openingDate: Date | null;
  closedDate?: Date | null;
  userId: string | null;
  enabled?: boolean;
};

export type ConstructionPaginationParam = {
  size: number;
  page: number;
  name: string;
  type: string;
};
