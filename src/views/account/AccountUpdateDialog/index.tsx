import LabelTitle from "@/components/LabelTitle";
import { AccountSimpleList } from "@/services/account/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

interface AccountUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (account: AccountSimpleList) => void;
  data: AccountSimpleList;
}

function AccountUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: AccountUpdateDialog) {
  const [updatedAccount, setUpdatedAccount] = useState<AccountSimpleList>({
    id: data.id,
    name: data.name,
    favorite: data.favorite,
    enabled: data.enabled,
  });

  const [invalidName, setInvalidName] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!updatedAccount.name || updatedAccount.name === "");

    if (!invalidName) {
      onUpdate(updatedAccount);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Nova Conta"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="field flex flex-column gap-2">
        <LabelTitle
          text="Nome"
          htmlFor="name"
          className="font-semibold"
          required={true}
        />
        <InputText
          type="text"
          onChange={(e) => {
            setUpdatedAccount({ ...updatedAccount, name: e.target.value });
            setInvalidName(false);
          }}
          value={updatedAccount?.name}
        />
        {invalidName && <Message severity="error" text="Nome é obrigatório" />}
      </div>
      <div className="field flex flex-column gap-2">
        <LabelTitle
          text="Favorito ?"
          htmlFor="favorite"
          className="font-semibold"
        />
        <div className="flex align-items-center gap-2 w-full a">
          <div className="flex">
            <RadioButton
              value={true}
              name="Sim"
              onChange={(e) =>
                setUpdatedAccount({ ...updatedAccount, favorite: e.value })
              }
              checked={updatedAccount.favorite === true}
            />
            <label htmlFor="option1" className="ml-2">
              Sim
            </label>
          </div>
          <div className="flex">
            <RadioButton
              value={false}
              name="Não"
              onChange={(e) => {
                setUpdatedAccount({ ...updatedAccount, favorite: e.value });
              }}
              checked={updatedAccount.favorite === false}
            />
            <label htmlFor="option2" className="ml-2">
              Não
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Salvar"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </Dialog>
  );
}

export default AccountUpdateDialog;
