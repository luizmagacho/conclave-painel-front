import LabelTitle from "@/components/LabelTitle";
import { AccountSimpleList } from "@/services/account/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
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
    financialInstitute: data.financialInstitute,
    accountNumber: data.accountGroup,
    currency: data.currency,
    startBalance: data.startBalance,
    minBalance: data.minBalance,
    balance: data.balance,
    accountGroup: data.accountGroup,
    comment: data.comment,
    favorite: data.favorite,
    enabled: data.enabled,
  });

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidFinancialInstitute, setInvalidFinancialInstitute] =
    useState<boolean>(false);
  const [invalidAccountNumber, setInvalidAccountNumber] =
    useState<boolean>(false);
  const [invalidCurrency, setInvalidCurrency] = useState<boolean>(false);
  const [invalidStartBalance, setInvalidStartBalance] =
    useState<boolean>(false);
  const [invalidMinBalance, setInvalidMinBalance] = useState<boolean>(false);
  const [invalidAccountGroup, setInvalidAccountGroup] =
    useState<boolean>(false);

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
              setUpdatedAccount({ ...updatedAccount, name: e.target.value });
              setInvalidName(false);
            }}
            value={updatedAccount?.name}
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
              setUpdatedAccount({
                ...updatedAccount,
                financialInstitute: e.target.value,
              });
              setInvalidFinancialInstitute(false);
            }}
            value={updatedAccount?.financialInstitute}
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
              setUpdatedAccount({
                ...updatedAccount,
                accountNumber: e.target.value,
              });
              setInvalidAccountNumber(false);
            }}
            value={updatedAccount?.accountNumber}
          />
          {invalidAccountNumber && (
            <Message severity="error" text="Número da Conta é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Unidade Monetária"
            htmlFor="currency"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedAccount({
                ...updatedAccount,
                currency: e.target.value,
              });
              setInvalidCurrency(false);
            }}
            value={updatedAccount?.currency}
          />
          {invalidCurrency && (
            <Message severity="error" text="Unidade Monetaria é obrigatória" />
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
                setUpdatedAccount({
                  ...updatedAccount,
                  startBalance: e.value,
                });
                setInvalidStartBalance(false);
              }}
              value={updatedAccount?.startBalance}
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
                setUpdatedAccount({
                  ...updatedAccount,
                  minBalance: e.value,
                });
                setInvalidMinBalance(false);
              }}
              value={updatedAccount?.minBalance}
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
              setUpdatedAccount({
                ...updatedAccount,
                accountGroup: e.target.value,
              });
              setInvalidAccountGroup(false);
            }}
            value={updatedAccount?.accountGroup}
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
              setUpdatedAccount({ ...updatedAccount, comment: e.target.value });
            }}
            value={updatedAccount?.comment}
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
                    setUpdatedAccount({ ...updatedAccount, enabled: e.value })
                  }
                  checked={updatedAccount.enabled === true}
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
                    setUpdatedAccount({ ...updatedAccount, enabled: e.value });
                  }}
                  checked={updatedAccount.enabled === false}
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

export default AccountUpdateDialog;
