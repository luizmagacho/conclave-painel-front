import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { DefaultLayout } from "@/layouts";
import OrderList from "@/views/order/OrderList";

export default function Order(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <OrderProvider>
          <OrderList />
        </OrderProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
