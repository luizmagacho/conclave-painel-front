import { AuthProvider } from "@/context/AuthContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import SupplierList from "@/views/supplier/SupplierList";

export default function Supplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <SupplierProvider>
          <SupplierList />
        </SupplierProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
