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
};
