import { Purchase } from "@/services/purchase/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface PurchaseDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (purchaseId: string) => void;
  data: Purchase;
}

function PurchaseDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: PurchaseDeleteDialog) {
  return (
    <Dialog
      header="Excluir Compra"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>
          Tem certeza que deseja excluir a compra para obra {data.centerCost} ?
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

export default PurchaseDeleteDialog;
