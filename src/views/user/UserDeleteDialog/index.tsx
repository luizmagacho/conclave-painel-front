import { User } from "@/services/user/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface UserDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (userId: string) => void;
  data: User;
}

function UserDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: UserDeleteDialog) {
  return (
    <Dialog
      header="Excluir perfil"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>Tem certeza que deseja exluir o usuário {data.name} ?</h4>
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

export default UserDeleteDialog;
