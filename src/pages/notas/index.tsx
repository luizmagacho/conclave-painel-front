import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { CostProvider } from "@/context/CostContext";
import { DefaultLayout } from "@/layouts";
import CostListGeneral from "@/views/costs/CostListGeneral/indext";

export default function Cost(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <CostProvider>
            <CostListGeneral />
          </CostProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
