import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import PurchasePost from "@/views/purchase/PurchasePost";

export default function PostPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <MaterialProvider>
            <SupplierProvider>
              <PurchaseProvider>
                <PurchasePost />
              </PurchaseProvider>
            </SupplierProvider>
          </MaterialProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
