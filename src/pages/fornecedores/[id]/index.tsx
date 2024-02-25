import { AuthProvider } from "@/context/AuthContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { DefaultLayout } from "@/layouts";

export default function SelectedSupplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <MaterialProvider>
          <h1>Teste</h1>
        </MaterialProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
