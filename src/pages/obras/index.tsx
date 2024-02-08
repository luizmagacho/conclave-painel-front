import { ConstructionProvider } from "@/context/ConstructionContext";
import { DefaultLayout } from "@/layouts";
import ConstructionList from "@/views/construction/ConstructionList";

export default function Construction(): JSX.Element {
  return (
    <DefaultLayout>
      <ConstructionProvider>
        <ConstructionList />
      </ConstructionProvider>
    </DefaultLayout>
  );
}
