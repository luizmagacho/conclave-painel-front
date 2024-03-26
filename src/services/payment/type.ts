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
