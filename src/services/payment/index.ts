import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import { Payment, PaymentDTO, PaymentPaginationParam } from "./type";

const baseUrl = "/payment";
const api = getAPIClient();

export async function getPayments({
  page,
  size,
  beneficiary,
  paymentDate,
}: PaymentPaginationParam) {
  let res = await api.get<Pagination<Payment>>(baseUrl, {
    params: {
      page,
      size,
      beneficiary,
      paymentDate,
    },
  });

  return res.data;
}

export async function getPaymentsByAccountId(
  { page, size, beneficiary, paymentDate }: PaymentPaginationParam,
  accountId: number
) {
  let res = await api.get<Pagination<Payment>>(`${baseUrl}/${accountId}`, {
    params: {
      page,
      size,
      beneficiary,
      paymentDate,
    },
  });

  return res.data;
}

export async function postPayment(payment: PaymentDTO) {
  let res = await api.post(baseUrl, payment);
  return res.status;
}

export async function updatePayment(payment: Payment) {
  let res = await api.put(baseUrl, payment);
  return res.status;
}

export async function deletePayment(paymentId: string) {
  let resp = await api.delete(`${baseUrl}/${paymentId}`);

  return resp.status;
}
