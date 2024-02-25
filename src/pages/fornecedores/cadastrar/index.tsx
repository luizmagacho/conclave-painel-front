import { AuthProvider } from "@/context/AuthContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { DefaultLayout } from "@/layouts";

export default function PostSupplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <MaterialProvider>
          <h1>Vou criar</h1>
        </MaterialProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
