import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { ToastProvider } from "@/context/ToastContext";
import { DefaultLayout } from "@/layouts";
import PurchaseList from "@/views/purchase/PurchaseList";

export default function Purchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ToastProvider>
          <ConstructionProvider>
            <PurchaseProvider>
              <PurchaseList />
            </PurchaseProvider>
          </ConstructionProvider>
        </ToastProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
