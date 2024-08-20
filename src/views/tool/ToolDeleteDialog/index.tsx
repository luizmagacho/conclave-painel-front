import { Tool } from "@/services/tool/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface ToolDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (toolId: string) => void;
  data: Tool;
}

function ToolDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: ToolDeleteDialog) {
  return (
    <Dialog
      header="Excluir Ferramenta"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>
          Tem certeza que deseja exluir a nota da obra {data.name} da obra{" "}
          {data.centerCost} ?
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
export default ToolDeleteDialog;
