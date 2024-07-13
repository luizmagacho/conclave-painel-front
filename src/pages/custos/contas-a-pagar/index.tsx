import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { CostProvider } from "@/context/CostContext";
import { DefaultLayout } from "@/layouts";
import CostPurchaseList from "@/views/costs/CostPurchaseList";

export default function CostPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <CostProvider>
            <CostPurchaseList />
          </CostProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
