import { ConstructionProvider } from "@/context/ConstructionContext";
import { OutstandingInvoicesProvider } from "@/context/OutstandingInvoiceContext";
import { SupplierProvider } from "@/context/SupplierContext";
import { DefaultLayout } from "@/layouts";
import OutstandingInvoicesConstructionList from "@/views/outstandingInvoices/OutstandingInvoicesConstructionList";

export default function OutstandingInvoice(): JSX.Element {
  return (
    <DefaultLayout>
      <ConstructionProvider>
        <SupplierProvider>
          <OutstandingInvoicesProvider>
            <OutstandingInvoicesConstructionList />
          </OutstandingInvoicesProvider>
        </SupplierProvider>
      </ConstructionProvider>
    </DefaultLayout>
  );
}
