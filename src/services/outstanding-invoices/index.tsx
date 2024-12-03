import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
  OutstandingInvoicesDateExport,
  OutstandingInvoicesPaginationParam,
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
    },
  });

  return res.data;
}

export async function getOutstandingInvoicesByCenterCostId(
  centerCostId: string,
  { page, size }: OutstandingInvoicesPaginationParam
) {
  let res = await api.get<Pagination<OutstandingInvoices>>(
    `${baseUrl}/center-cost/${centerCostId}`
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
}: OutstandingInvoicesPaginationParam) {
  let res = await api.get<OutstandingInvoicesVendorExport[]>(
    `${baseUrl}/prepare-export`,
    {
      params: {
        page,
        size,
        centerCost,
        vendorName,
        paymentDeadlineFrom,
        paymentDeadlineTo,
      },
    }
  );

  return res.data;
}

export async function getAllCategories() {
  let res = await api.get<string[]>(`${baseUrl}/category`);
  return res.data;
}
