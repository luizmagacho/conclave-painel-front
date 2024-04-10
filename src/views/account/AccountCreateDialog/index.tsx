import LabelTitle from "@/components/LabelTitle";
import { AccountDTO } from "@/services/account/type";
import { Payment } from "@/services/payment/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
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
    financialInstitute: "",
    accountNumber: "",
    balance: 0,
    startBalance: 0,
    minBalance: 0,
    accountGroup: "",
    comment: "",
    favorite: false,
    enabled: true,
    payments: [],
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidFinancialInstitute, setInvalidFinancialInstitute] =
    useState<boolean>(false);
  const [invalidAccountNumber, setInvalidAccountNumber] =
    useState<boolean>(false);
  const [invalidStartBalance, setInvalidStartBalance] =
    useState<boolean>(false);
  const [invalidMinBalance, setInvalidMinBalance] = useState<boolean>(false);
  const [invalidAccountGroup, setInvalidAccountGroup] =
    useState<boolean>(false);
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
      className="w-30rem"
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
            text="Instituição Financeira"
            htmlFor="financialInstitute"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewAccount({
                ...newAccount,
                financialInstitute: e.target.value,
              });
              setInvalidFinancialInstitute(false);
            }}
            value={newAccount?.financialInstitute}
          />
          {invalidFinancialInstitute && (
            <Message
              severity="error"
              text="Instituição Financeira é obrigatório"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Número da Conta"
            htmlFor="accountNumber"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewAccount({ ...newAccount, accountNumber: e.target.value });
              setInvalidAccountNumber(false);
            }}
            value={newAccount?.accountNumber}
          />
          {invalidAccountNumber && (
            <Message severity="error" text="Número da Conta é obrigatório" />
          )}
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Saldo Inicial"
              htmlFor="startBalance"
              className="font-semibold text-sm"
              required={true}
            />
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              onChange={(e) => {
                setNewAccount({
                  ...newAccount,
                  startBalance: e.value,
                });
                setInvalidStartBalance(false);
              }}
              value={newAccount?.startBalance}
            />
            {invalidStartBalance && (
              <Message severity="error" text="Logradouro é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Saldo Mínimo"
              htmlFor="minBalance"
              className="font-semibold text-sm"
            />
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              onChange={(e) => {
                setNewAccount({
                  ...newAccount,
                  minBalance: e.value,
                });
                setInvalidMinBalance(false);
              }}
              value={newAccount?.minBalance}
            />
            {invalidMinBalance && (
              <Message severity="error" text="Saldo Mínimo é obrigatório" />
            )}
          </div>
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Grupo de contas"
            htmlFor="accountGroup"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewAccount({ ...newAccount, accountGroup: e.target.value });
              setInvalidAccountGroup(false);
            }}
            value={newAccount?.accountGroup}
          />
          {invalidAccountGroup && (
            <Message severity="error" text="Grupo de contas é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Cometários"
            htmlFor="comments"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewAccount({ ...newAccount, comment: e.target.value });
            }}
            value={newAccount?.comment}
          />
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
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
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Conta Ativa ?"
              htmlFor="enabled"
              className="font-semibold"
            />
            <div className="flex align-items-center gap-2 w-full a">
              <div className="flex">
                <RadioButton
                  value={true}
                  name="Sim"
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, enabled: e.value })
                  }
                  checked={newAccount.enabled === true}
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
                    setNewAccount({ ...newAccount, enabled: e.value });
                  }}
                  checked={newAccount.enabled === false}
                />
                <label htmlFor="option2" className="ml-2">
                  Não
                </label>
              </div>
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
