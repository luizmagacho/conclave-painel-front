export type Payment = {
  id: number;
  numberCheckTransfer: string;
  paymentDate: Date;
  weekOfTheYear: number;
  beneficiary: string;
  cleared: boolean;
  withdraw: number;
  deposit: number;
  balance: number;
  accountId: number;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaymentDTO = {
  numberCheckTransfer: string;
  paymentDate: Date;
  beneficiary: string;
  cleared: boolean;
  withdraw: number;
  deposit: number;
  balance: number;
  accountId: number;
  enabled: boolean;
};

export type PaymentPaginationParam = {
  size: number;
  page: number;
  beneficiary?: string;
  paymentDate?: Date;
};
