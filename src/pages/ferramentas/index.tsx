import { AuthProvider } from "@/context/AuthContext";
import { ToolProvider } from "@/context/ToolContext";
import { DefaultLayout } from "@/layouts";
import ToolList from "@/views/tool/ToolList";

export default function Tool(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ToolProvider>
          <ToolList />
        </ToolProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
