import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { OrderProvider } from "@/context/OrderContext";
import { DefaultLayout } from "@/layouts";
import OrderCreate from "@/views/order/OrderCreate";

export default function PostOrder(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <OrderProvider>
          <ConstructionProvider>
            <MaterialProvider>
              <OrderCreate />
            </MaterialProvider>
          </ConstructionProvider>
        </OrderProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
