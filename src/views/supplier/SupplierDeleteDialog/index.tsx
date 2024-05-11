import { Supplier } from "@/services/supplier/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface SupplierDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (supplierId: string) => void;
  data: Supplier;
}

function SupplierDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: SupplierDeleteDialog) {
  return (
    <Dialog
      header="Excluir fornecedor"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>Tem certeza que deseja exluir o perfil {data.completeName} ?</h4>
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

export default SupplierDeleteDialog;
