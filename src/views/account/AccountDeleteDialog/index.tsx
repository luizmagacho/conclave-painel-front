import { AccountSimpleList } from "@/services/account/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface AccountDeleteDialog {
  visible: boolean;
  onHide: () => void;
  onDelete: (accountId: string) => void;
  data: AccountSimpleList;
}

function AccountDeleteDialog({
  visible,
  onHide,
  onDelete,
  data,
}: AccountDeleteDialog) {
  return (
    <Dialog
      header="Excluir Conta Bancária"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>Tem certeza que deseja exluir a conta {data.name} ?</h4>
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

export default AccountDeleteDialog;
