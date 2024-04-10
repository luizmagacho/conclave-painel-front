export type Supplier = {
  id: number;
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
  sellerEmail: string;
  financialName: string;
  financialPhone: string;
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
  sellerEmail: string;
  financialName: string;
  financialPhone: string;
  financialEmail: string;
  bank1: string;
  bank2: string;
  bank3: string;
  userId: string;
  enabled: boolean;
};

export type SupplierPaginationParam = {
  size: number;
  page: number;
  completeName?: string;
  type?: string;
};
