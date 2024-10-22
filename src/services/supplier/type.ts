export type Supplier = {
  id: string;
  cnpj: string;
  cpf: string;
  completeName: string;
  shortenedName: string;
  streetAddress: string;
  neighborhood: string;
  city: string;
  cep: string;
  sellerName: string;
  sellerPhone: string;
  sellerMobilePhone: string;
  sellerEmail: string;
  financialName: string;
  financialPhone: string;
  financialMobilePhone: string;
  financialEmail: string;
  bank1: string;
  bank2: string;
  bank3: string;
  userId: string;
  enabled: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type SupplierDTO = {
  cnpj: string;
  cpf: string;
  completeName: string;
  shortenedName: string;
  streetAddress: string;
  neighborhood: string;
  city: string;
  cep: string;
  sellerName: string;
  sellerPhone: string;
  sellerMobilePhone: string;
  sellerEmail: string;
  financialName: string;
  financialPhone: string;
  financialMobilePhone: string;
  financialEmail: string;
  bank1: string;
  bank2: string;
  bank3: string;
  userId: string;
  enabled: boolean;
};

export type SupplierName = {
  shortenedName: string;
};

export type SupplierPaginationParam = {
  size: number;
  page: number;
  completeName?: string;
  shortenedName?: string;
  type?: string;
};

export type SupplierRecord = {
  id?: string;
  shortenedName: string;
};
