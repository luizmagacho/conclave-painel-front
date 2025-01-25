import { ConstructionProvider } from "@/context/ConstructionContext";
import { CostProvider } from "@/context/CostContext";
import { DefaultLayout } from "@/layouts";
import CostList from "@/views/costs/CostsList";

export default function Cost(): JSX.Element {
  return (
    <DefaultLayout>
      <ConstructionProvider>
        <CostProvider>
          <CostList />
        </CostProvider>
      </ConstructionProvider>
    </DefaultLayout>
  );
}
