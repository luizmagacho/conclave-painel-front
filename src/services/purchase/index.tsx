import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import {
  Purchase,
  PurchaseDTO,
  PurchasePaginationParam,
  SupplierMaterialToExport,
} from "./type";

const baseUrl = "/purchase";
const api = getAPIClient();

export async function getPurchases({ page, size }: PurchasePaginationParam) {
  let res = await api.get<Pagination<Purchase>>(baseUrl, {
    params: {
      page,
      size,
    },
  });

  return res.data;
}

export async function postPurchase(purchase: PurchaseDTO) {
  let res = await api.post(baseUrl, purchase);
  return res.status;
}

export async function getPurchaseById(purchaseId: string) {
  let res = await api.get<Purchase>(`${baseUrl}/${purchaseId}`);
  return res.data;
}

export async function getSuppliersToExport(purchaseId: string) {
  let res = await api.get<SupplierMaterialToExport[]>(
    `${baseUrl}/${purchaseId}/suppliers`
  );
  return res.data;
}

export async function updatePurchase(purchase: Purchase) {
  let res = await api.put(baseUrl, purchase);
  return res.status;
}

export async function deletePurchase(purchaseId: string) {
  let res = await api.delete(`${baseUrl}/${purchaseId}`);
  return res.status;
}
