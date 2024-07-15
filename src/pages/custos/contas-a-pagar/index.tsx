import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { CostProvider } from "@/context/CostContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import CostPurchaseList from "@/views/costs/CostPurchaseList";

export default function CostPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <SupplierProvider>
          <ConstructionProvider>
            <CostProvider>
              <CostPurchaseList />
            </CostProvider>
          </ConstructionProvider>
        </SupplierProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
