import { Pagination } from "@/types/pagination";
import { getAPIClient } from "../axios";
import { Order, OrderDTO, OrderPaginationParam } from "./type";

const baseUrl = "/order";
const api = getAPIClient();

export async function getOrders({
  page,
  size,
  constructionCode,
  finish,
  orderDate,
}: OrderPaginationParam) {
  let res = await api.get<Pagination<Order>>(baseUrl, {
    params: {
      page,
      size,
      constructionCode,
      finish,
      orderDate,
    },
  });

  return res.data;
}

export async function getOrderById(orderId: string) {
  let res = await api.get<Order>(`${baseUrl}/${orderId}`);
  return res.data;
}

export async function getAllOrders() {
  let res = await api.get<Order[]>(`${baseUrl}/all`);
  return res.data;
}

export async function postOrder(order: OrderDTO) {
  let res = await api.post(baseUrl, order);
  return res.status;
}

export async function updateOrder(order: Order) {
  let res = await api.put(baseUrl, order);
  return res.status;
}

export async function finishOrder(orderId: string) {
  let res = await api.patch(`${baseUrl}/${orderId}`);
  return res.status;
}
