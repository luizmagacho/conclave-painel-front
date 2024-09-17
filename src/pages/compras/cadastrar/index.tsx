import { AuthProvider } from "@/context/AuthContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import PurchasePost from "@/views/purchase/PurchasePost";

export default function PostPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <MaterialProvider>
          <SupplierProvider>
            <PurchaseProvider>
              <PurchasePost />
            </PurchaseProvider>
          </SupplierProvider>
        </MaterialProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
