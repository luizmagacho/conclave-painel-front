import { AccountProvider } from "@/context/AccountContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import PaymentList from "@/views/payment/PaymentList";

export default function Payment(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <AccountProvider>
          <ConstructionProvider>
            <PaymentProvider>
              <SupplierProvider>
                <PaymentList />
              </SupplierProvider>
            </PaymentProvider>
          </ConstructionProvider>
        </AccountProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
