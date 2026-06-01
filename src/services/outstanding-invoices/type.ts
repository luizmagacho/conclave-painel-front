export type OutstandingInvoices = {
  id: string;
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  purchaseDateFormatted: string;
  paymentDeadline: string;
  paymentDeadlineFormatted: string;
  costType: string;
  costCategory: string;
  name: string;
  vendorName: string;
  totalAmount: number;
  userId: string;
  enabled: boolean;
  additionalDetails: string;
  paymentStatus: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  /** Links all installments of the same invoice together. */
  groupId?: string | null;
  /** 1-based position of this installment (e.g. 3). Null for single-payment invoices. */
  installmentNumber?: number | null;
  /** Total installments in the group (e.g. 10). Null for single-payment invoices. */
  totalInstallments?: number | null;
};

export type OutstandingInvoicesDTO = {
  centerCost: string;
  centerCostId: string;
  bankBranch: string;
  localBank: string;
  purchaseDate: string;
  paymentDeadline: string;
  costType: string;
  costCategory: string;
  name: string;
  vendorName: string;
  totalAmount: number;
  userId: string;
  enabled: boolean;
  additionalDetails: string;
  paymentStatus: boolean;
  /** Links all installments of the same invoice together. */
  groupId?: string | null;
  /** 1-based position of this installment (e.g. 3). */
  installmentNumber?: number | null;
  /** Total installments in the group (e.g. 10). */
  totalInstallments?: number | null;
  /**
   * UI-only: number of installments to generate.
   * Sent to the backend which generates N monthly rows.
   */
  numberOfInstallments?: number;
};

export type OutstandingInvoicesPaginationParam = {
  size: number;
  page: number;
  centerCost?: string;
  localBank?: string;
  vendorName?: string;
  paymentDeadlineFrom?: string;
  paymentDeadlineTo?: string;
  additionalDetails?: string;
  sort?: string;
};

export interface OutstandingInvoicesVendorExport {
  name: string;
  sumAmount: number;
  periodOfDate: string;
  outstandingInvoices: OutstandingInvoicesExport[];
}

export interface OutstandingInvoicesDateExport {
  date: string;
  outstadingInvoicesVendor: OutstandingInvoicesVendorExport[];
}

export type OutstandingInvoicesExport = {
  centerCost?: string;
  bankBranch?: string;
  localBank?: string;
  purchaseDate?: string;
  purchaseDateFormatted?: string;
  paymentDeadline?: string;
  paymentDeadlineFormatted?: string;
  costType?: string;
  costCategory?: string;
  name?: string;
  vendorName?: string;
  totalAmount?: number | null;
  additionalDetails?: string;
  paymentStatus?: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
};

export type OutstandingInvoicesSumTotalValueParam = {
  centerCost?: string;
  localBank?: string;
  vendorName?: string;
  paymentDeadlineFrom?: string;
  paymentDeadlineTo?: string;
  additionalDetails?: string;
  sort?: string;
};
