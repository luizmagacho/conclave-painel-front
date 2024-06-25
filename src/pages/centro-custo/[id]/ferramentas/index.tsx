import { ConstructionProvider } from "@/context/ConstructionContext";
import { ToolProvider } from "@/context/ToolContext";
import { DefaultLayout } from "@/layouts";
import ToolListCenterCost from "@/views/tool/ToolListCenterCost";

export default function ToolsByCenterCost(): JSX.Element {
  return (
    <DefaultLayout>
      <ConstructionProvider>
        <ToolProvider>
          <ToolListCenterCost />
        </ToolProvider>
      </ConstructionProvider>
    </DefaultLayout>
  );
}
