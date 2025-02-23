import { Pagination } from "@/types/pagination";
import {
  Supplier,
  SupplierDTO,
  SupplierPaginationParam,
  SupplierRecord,
} from "./type";
import { getAPIClient } from "../axios";

const baseUrl = "/supplier";
const api = getAPIClient();

export async function getSuppliers({
  page,
  size,
  completeName,
  shortenedName,
  type,
  cnpj,
  cpf,
}: SupplierPaginationParam) {
  let res = await api.get<Pagination<Supplier>>(baseUrl, {
    params: {
      page,
      size,
      completeName,
      shortenedName,
      type,
      cnpj,
      cpf,
    },
  });

  return res.data;
}

export async function getSupplierById(supplierId: string) {
  let res = await api.get<Supplier>(`${baseUrl}/${supplierId}`);
  return res.data;
}

export async function postSupplier(supplier: SupplierDTO) {
  let res = await api.post(baseUrl, supplier);
  return res.status;
}

export async function updateSupplier(supplier: Supplier) {
  let res = await api.put(baseUrl, supplier);
  return res.status;
}

export async function getAllSuppliers() {
  let res = await api.get<Supplier[]>(`${baseUrl}/all`);
  return res.data;
}

export async function getAllSuppliersShortenedName() {
  let res = await api.get<SupplierRecord[]>(`${baseUrl}/all-shortened-name`);
  return res.data;
}

export async function deleteSupplier(supplierId: string) {
  let res = await api.delete(`${baseUrl}/${supplierId}`);
  return res.status;
}

export async function validateCpf(id: string, cpf: string) {
  let res = await api.get(`${baseUrl}/validate-cpf`, {
    params: {
      id,
      cpf,
    },
  });
  return res.data;
}

export async function validateCnpj(id: string, cnpj: string) {
  let res = await api.get(`${baseUrl}/validate-cnpj`, {
    params: {
      id,
      cnpj,
    },
  });
  return res.data;
}

export async function validateShortenedName(id: string, shortenedName: string) {
  let res = await api.get(`${baseUrl}/validate-shortened-name`, {
    params: { id, shortenedName },
  });
  return res.data;
}
