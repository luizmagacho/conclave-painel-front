import { AuthProvider } from "@/context/AuthContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import SupplierCreate from "@/views/supplier/SupplierCreate";

export default function PostSupplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <SupplierProvider>
          <SupplierCreate />
        </SupplierProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
