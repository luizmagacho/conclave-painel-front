import { AuthProvider } from "@/context/AuthContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import SupplierCompleteInfo from "@/views/supplier/SupplierCompleteInfo";

export default function SelectedSupplier(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <SupplierProvider>
          <SupplierCompleteInfo />
        </SupplierProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
