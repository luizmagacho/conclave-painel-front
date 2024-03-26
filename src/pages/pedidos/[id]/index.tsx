import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { DefaultLayout } from "@/layouts";
import OrderCompleteInfo from "@/views/order/OrderCompleteInfo";

export default function SelectedOrder(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <OrderProvider>
          <OrderCompleteInfo />
        </OrderProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
