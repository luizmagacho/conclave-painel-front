import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import PurchaseUpdate from "@/views/purchase/PurchaseUpdate";

export default function SelectedPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <MaterialProvider>
            <SupplierProvider>
              <PurchaseProvider>
                <PurchaseUpdate />
              </PurchaseProvider>
            </SupplierProvider>
          </MaterialProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
