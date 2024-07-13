import { AuthProvider } from "@/context/AuthContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { OrderProvider } from "@/context/OrderContext";
import { DefaultLayout } from "@/layouts";
import OrderCompleteInfo from "@/views/order/OrderCompleteInfo";

export default function SelectedOrder(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <MaterialProvider>
          <OrderProvider>
            <OrderCompleteInfo />
          </OrderProvider>
        </MaterialProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
