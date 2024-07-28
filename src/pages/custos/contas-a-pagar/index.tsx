import { AuthProvider } from "@/context/AuthContext";
import { ConstructionProvider } from "@/context/ConstructionContext";
import { OutstandingInvoicesProvider } from "@/context/OutstandingInvoiceContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import OutstandingInvoicesList from "@/views/outstandingInvoices/OutstandingInvoicesList";

export default function CostPurchase(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <SupplierProvider>
          <ConstructionProvider>
            <OutstandingInvoicesProvider>
              <OutstandingInvoicesList />
            </OutstandingInvoicesProvider>
          </ConstructionProvider>
        </SupplierProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
