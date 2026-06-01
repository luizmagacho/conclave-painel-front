import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
  OutstandingInvoicesDateExport,
  OutstandingInvoicesPaginationParam,
  OutstandingInvoicesSumTotalValueParam,
  OutstandingInvoicesVendorExport,
} from "./type";

const baseUrl = "/outstanding-invoices";
const api = getAPIClient();

export async function getOutstandingInvoices({
  page,
  size,
  centerCost,
  localBank,
  vendorName,
  paymentDeadlineFrom,
  paymentDeadlineTo,
  additionalDetails,
  sort,
}: OutstandingInvoicesPaginationParam) {
  let res = await api.get<Pagination<OutstandingInvoices>>(baseUrl, {
    params: {
      page,
      size,
      centerCost,
      localBank,
      vendorName,
      paymentDeadlineFrom,
      paymentDeadlineTo,
      additionalDetails,
      sort,
    },
  });

  return res.data;
}

export async function getOutstandingInvoicesByCenterCostId(
  centerCostId: string,
  {
    page,
    size,
    vendorName,
    paymentDeadlineFrom,
    paymentDeadlineTo,
    additionalDetails,
    sort,
  }: OutstandingInvoicesPaginationParam
) {
  let res = await api.get<Pagination<OutstandingInvoices>>(
    `${baseUrl}/center-cost/${centerCostId}`,
    {
      params: {
        page,
        size,
        vendorName,
        paymentDeadlineFrom,
        paymentDeadlineTo,
        additionalDetails,
        sort,
      },
    }
  );
  return res.data;
}

export async function postOutstandingInvoices(
  outstandingInvoices: OutstandingInvoicesDTO
) {
  let res = await api.post(baseUrl, outstandingInvoices);
  return res.status;
}

export async function updateOutstandingInvoices(
  outstandingInvoices: OutstandingInvoices
) {
  let res = await api.put(baseUrl, outstandingInvoices);
  return res.status;
}

export async function deleteOutstandingInvoices(outstandingInvoicesId: string) {
  let res = await api.delete(`${baseUrl}/${outstandingInvoicesId}`);
  return res.status;
}

export async function getOutstandingInvoicesToExport({
  page,
  size,
  centerCost,
  vendorName,
  paymentDeadlineFrom,
  paymentDeadlineTo,
  additionalDetails,
  sort,
}: OutstandingInvoicesPaginationParam): Promise<OutstandingInvoicesVendorExport[]> {
  let res = await api.get<Pagination<OutstandingInvoices>>(baseUrl, {
    params: {
      page: 0,
      size: 10000, // Fetch all records for export
      centerCost,
      vendorName,
      paymentDeadlineFrom,
      paymentDeadlineTo,
      additionalDetails,
      sort,
    },
  });

  const invoices = res.data.content || [];
  const grouped: Record<string, OutstandingInvoicesVendorExport> = {};

  const periodStr =
    paymentDeadlineFrom && paymentDeadlineTo
      ? `${paymentDeadlineFrom.split("-").reverse().join("/")} até ${paymentDeadlineTo.split("-").reverse().join("/")}`
      : paymentDeadlineFrom
      ? `A partir de ${paymentDeadlineFrom.split("-").reverse().join("/")}`
      : paymentDeadlineTo
      ? `Até ${paymentDeadlineTo.split("-").reverse().join("/")}`
      : "Todo o período";

  invoices.forEach((inv) => {
    const vendor = inv.vendorName || "Sem Favorecido";
    if (!grouped[vendor]) {
      grouped[vendor] = {
        name: vendor,
        sumAmount: 0,
        periodOfDate: periodStr,
        outstandingInvoices: [],
      };
    }
    grouped[vendor].sumAmount += inv.totalAmount || 0;
    grouped[vendor].outstandingInvoices.push(inv);
  });

  return Object.values(grouped);
}

export async function getAdditionalDetailsFromVendor(vendorName: string) {
  let res = await api.get<string>(
    `${baseUrl}/vendor/${vendorName}/latest-additional-details`
  );
  return res.data;
}

export async function getAllCategories() {
  let res = await api.get<string[]>(`${baseUrl}/category`);
  return res.data;
}

export async function sumTotalValueByFilters({
  centerCost,
  localBank,
  vendorName,
  paymentDeadlineFrom,
  paymentDeadlineTo,
  additionalDetails,
  sort,
}: OutstandingInvoicesSumTotalValueParam) {
  let res = await api.get<number>(`${baseUrl}/sum-total-value`, {
    params: {
      centerCost,
      localBank,
      vendorName,
      paymentDeadlineFrom,
      paymentDeadlineTo,
      additionalDetails,
      sort,
    },
  });

  return res.data;
}

export async function getInstallmentsByGroupId(groupId: string) {
  let res = await api.get<OutstandingInvoices[]>(`${baseUrl}/group/${groupId}`);
  return res.data;
}

export async function recalculateInstallments(
  outstandingInvoicesId: string,
  numberOfInstallments: number,
  interestRate: number
) {
  let res = await api.put(
    `${baseUrl}/${outstandingInvoicesId}/recalculate-installments`,
    {
      numberOfInstallments,
      interestRate,
    }
  );
  return res.status;
}
