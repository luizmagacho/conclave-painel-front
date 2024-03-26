import { AuthProvider } from "@/context/AuthContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { ToastProvider } from "@/context/ToastContext";
import { DefaultLayout } from "@/layouts";
import SupplierList from "@/views/supplier/SupplierList";

export default function Supplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ToastProvider>
          <SupplierProvider>
            <SupplierList />
          </SupplierProvider>
        </ToastProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
