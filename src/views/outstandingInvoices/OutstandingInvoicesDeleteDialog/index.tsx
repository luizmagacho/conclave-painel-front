import { OutstandingInvoices } from "@/services/outstanding-invoices/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface OutstandingInvoicesDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (OutstandingInvoicesId: string) => void;
  data: OutstandingInvoices;
}

function OutstandingInvoicesDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: OutstandingInvoicesDeleteDialog) {
  const formatCurrency = (value: number | null) => {
    if (!value) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  return (
    <Dialog
      header="Excluir Conta a Pagar"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>
          Tem certeza que deseja exluir a conta a pagar de {data.centerCost} do
          valor de {formatCurrency(data.totalAmount)} ?
        </h4>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Excluir"
          severity="danger"
          onClick={() => {
            onDelete(data.id);
            onHide();
          }}
        />
      </div>
    </Dialog>
  );
}

export default OutstandingInvoicesDeleteDialog;
