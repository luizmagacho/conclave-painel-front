import {
  finishOrder,
  getOrderById,
  getOrders,
  postOrder,
  updateOrder,
} from "@/services/order";
import { Order, OrderDTO } from "@/services/order/type";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface OrderContextProps {
  ordersNotFinished: Order[];
  ordersFinished: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  totalElementsNotFinished: number;
  totalElementsFinished: number;
  handleGetOrdersNotFinished: (
    page?: number,
    constructionCode?: string,
    orderDate?: Date | null,
    finish?: boolean
  ) => Promise<void>;
  handleGetOrdersFinished: (
    page?: number,
    constructionCode?: string,
    orderDate?: Date | null,
    finish?: boolean
  ) => Promise<void>;
  handleGetOrderById: (orderId: string) => Promise<void>;
  handlePostOrder: (order: OrderDTO) => Promise<void>;
  handleUpdateOrder: (order: Order) => Promise<void>;
  handlePatchOrderFinished: (orderId: string) => Promise<void>;
}

export const OrderContext = createContext({} as OrderContextProps);

export const OrderProvider = ({ children }: ProviderProps) => {
  const [ordersNotFinished, setOrdersNotFinished] = useState<Order[]>([]);
  const [ordersFinished, setOrdersFinished] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElementsNotFinished, setTotalElementsNotFinished] =
    useState<number>(0);
  const [totalElementsFinished, setTotalElementsFinished] = useState<number>(0);

  async function handleGetOrdersNotFinished(
    page: number = 0,
    constructionCode: string = "",
    orderDate: Date | null = null,
    finish: boolean = false
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getOrders({
        page,
        size: 10,
        constructionCode,
        orderDate,
        finish,
      });
      setOrdersNotFinished(content || []);
      setTotalElementsNotFinished(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      console.log(ordersNotFinished);
    }
  }

  async function handleGetOrderById(orderId: string) {
    setLoading(true);
    try {
      const order = await getOrderById(orderId);
      await setSelectedOrder(order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetOrdersFinished(
    page: number = 0,
    constructionCode: string = "",
    orderDate: Date | null = null,
    finish: boolean = true
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getOrders({
        page,
        size: 10,
        constructionCode,
        orderDate,
        finish,
      });
      setOrdersFinished(content || []);
      setTotalElementsFinished(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostOrder(order: OrderDTO) {
    setLoading(true);

    try {
      const resp = await postOrder(order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrder(order: Order) {
    setLoading(true);

    try {
      const resp = await updateOrder(order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePatchOrderFinished(orderId: string) {
    setLoading(true);

    try {
      const resp = await finishOrder(orderId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetOrdersNotFinished();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        ordersNotFinished,
        ordersFinished,
        selectedOrder,
        loading,
        totalElementsNotFinished,
        totalElementsFinished,
        handleGetOrdersNotFinished,
        handleGetOrdersFinished,
        handleGetOrderById,
        handlePostOrder,
        handleUpdateOrder,
        handlePatchOrderFinished,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
