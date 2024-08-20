import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { ToolProvider } from "@/context/ToolContext";
import { DefaultLayout } from "@/layouts";
import ToolList from "@/views/tool/ToolList";

export default function Tool(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ConstructionProvider>
          <ToolProvider>
            <ToolList />
          </ToolProvider>
        </ConstructionProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
