import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import {
  Category,
  CategoryDTO,
  Payment,
  PaymentByAccountIdPaginationParam,
  PaymentDTO,
  PaymentPaginationParam,
  SubCategory,
  SubCategoryDTO,
} from "./type";

const baseUrl = "/payment";
const api = getAPIClient();

export async function getPayments({ page, size }: PaymentPaginationParam) {
  let res = await api.get<Pagination<Payment>>(baseUrl, {
    params: {
      page,
      size,
    },
  });

  return res.data;
}

export async function getPaymentsByAccountId(
  {
    page,
    size,
    searchType,
    centerCost,
    beneficiary,
    paymentDate,
    week,
  }: PaymentByAccountIdPaginationParam,
  accountId: number
) {
  let res = await api.get<Pagination<Payment>>(
    `${baseUrl}/account/${accountId}`,
    {
      params: {
        page,
        size,
        searchType,
        centerCost,
        beneficiary,
        paymentDate,
        week,
      },
    }
  );

  return res.data;
}

export async function getAllCategories() {
  let res = await api.get<Category[]>(`${baseUrl}/category`);
  return res.data;
}

export async function getAllSubCategories() {
  let res = await api.get<SubCategory[]>(`${baseUrl}/subcategory`);
  return res.data;
}

export async function postPayment(payment: PaymentDTO) {
  let res = await api.post(baseUrl, payment);
  return res.status;
}

export async function postCategory(category: CategoryDTO) {
  let res = await api.post(`${baseUrl}/category`, category);
  return res.status;
}

export async function postSubCategory(subCategory: SubCategoryDTO) {
  let res = await api.post(`${baseUrl}/subcategory`, subCategory);
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
