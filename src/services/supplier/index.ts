import { Pagination } from "@/types/pagination";
import http from "../http";
import { Supplier, SupplierDTO, SupplierPaginationParam } from "./type";

const baseUrl = "/supplier";

export async function getSuppliers({
  page,
  size,
  name,
  type,
}: SupplierPaginationParam) {
  let res = await http.get<Pagination<Supplier>>(baseUrl, {
    params: {
      page,
      size,
      name,
      type,
    },
  });

  return res.data;
}

export async function postSupplier(supplier: SupplierDTO) {
  let res = await http.post(baseUrl, supplier);
  return res.status;
}

export async function updateSupplier(supplier: Supplier) {
  let res = await http.put(baseUrl, supplier);
  return res.status;
}

export async function getAllSuppliers() {
  let res = await http.get<Supplier[]>(`${baseUrl}/all`);
  return res.data;
}

export async function deleteSupplier(supplierId: string) {
  let res = await http.delete(`${baseUrl}/${supplierId}`);
  return res.status;
}
