export type Construction = {
  id: string;
  code: string;
  bankBranch: string;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  isCad: string;
  upe: string;
  sap: string;
  openingDate: string;
  openingDateFormatted?: string;
  closedDate: string | null;
  closedDateFormatted?: string;
  totalBilled: number;
  totalRemas: number;
  userId: string;
  enabled: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ConstructionDTO = {
  code: string;
  bankBranch: string;
  client: string;
  local: string;
  responsible: string;
  service: string;
  cad: boolean;
  upe?: string;
  sap?: string;
  openingDate?: Date | null;
  closedDate?: Date | null;
  totalBilled?: number;
  totalRemas?: number;
  userId: string | null;
  enabled?: boolean;
};

export type ConstructionPaginationParam = {
  size: number;
  page: number;
  code: string;
  bankBranch: string;
  localBank: string;
};
