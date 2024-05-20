import { Construction } from "@/services/construction/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface ConstructionDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (constructionId: string) => void;
  data: Construction;
}

function ConstructionDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: ConstructionDeleteDialog) {
  return (
    <Dialog
      header="Encerrar Centro de Custo"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>Tem certeza que deseja encerrar o centro de custo {data.code} ?</h4>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Encerrar"
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

export default ConstructionDeleteDialog;
