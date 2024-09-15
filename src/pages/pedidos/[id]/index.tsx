import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { OrderProvider } from "@/context/OrderContext";
import { DefaultLayout } from "@/layouts";
import OrderCompleteInfo from "@/views/order/OrderCompleteInfo";

export default function SelectedOrder(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <MaterialProvider>
            <OrderProvider>
              <OrderCompleteInfo />
            </OrderProvider>
          </MaterialProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
