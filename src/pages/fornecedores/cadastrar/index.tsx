import { AuthProvider } from "@/context/AuthContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { ToastProvider } from "@/context/ToastContext";
import { DefaultLayout } from "@/layouts";
import SupplierCreate from "@/views/supplier/SupplierCreate";

export default function PostSupplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <ToastProvider>
          <SupplierProvider>
            <SupplierCreate />
          </SupplierProvider>
        </ToastProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
