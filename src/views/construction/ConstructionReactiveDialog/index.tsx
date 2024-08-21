import { Construction } from "@/services/construction/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface ConstructionReactiveDialog {
  visible: boolean;
  onHide: () => void;
  onReactive: (constructionId: string) => void;
  data: Construction;
}

function ConstructionReactiveDialog({
  visible,
  onHide,
  onReactive,
  data,
}: ConstructionReactiveDialog) {
  return (
    <Dialog
      header="Reativar Obra"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>Tem certeza que deseja reativar a obra {data.code} ?</h4>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Encerrar"
          severity="danger"
          onClick={() => {
            onReactive(data.id);
            onHide();
          }}
        />
      </div>
    </Dialog>
  );
}

export default ConstructionReactiveDialog;
