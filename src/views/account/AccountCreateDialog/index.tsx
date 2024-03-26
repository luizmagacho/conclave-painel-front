import LabelTitle from "@/components/LabelTitle";
import { AccountDTO } from "@/services/account/type";
import { Payment } from "@/services/payment/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

interface AccountCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (account: AccountDTO) => void;
}

function AccountCreateDialog({
  visible,
  onHide,
  onCreate,
}: AccountCreateDialog) {
  const [newAccount, setNewAccount] = useState<AccountDTO>({
    name: "",
    favorite: false,
    payments: [],
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!newAccount.name || newAccount.name === "");

    if (!invalidName) {
      onCreate(newAccount);
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
      <div>
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
              setNewAccount({ ...newAccount, name: e.target.value });
              setInvalidName(false);
            }}
            value={newAccount?.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
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
                  setNewAccount({ ...newAccount, favorite: e.value })
                }
                checked={newAccount.favorite === true}
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
                  setNewAccount({ ...newAccount, favorite: e.value });
                }}
                checked={newAccount.favorite === false}
              />
              <label htmlFor="option2" className="ml-2">
                Não
              </label>
            </div>
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

export default AccountCreateDialog;
