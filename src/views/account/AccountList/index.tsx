import InputSearch from "@/components/InputSearch";
import { AccountContext } from "@/context/AccountContext";
import {
  AccountDTO,
  AccountDetails,
  AccountSimpleList,
} from "@/services/account/type";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useContext, useState } from "react";
import AccountCreateDialog from "../AccountCreateDialog";
import { classNames } from "primereact/utils";
import AccountUpdateDialog from "../AccountUpdateDialog";
import AccountDeleteDialog from "../AccountDeleteDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (account: AccountSimpleList) => void;
}

function AccountList() {
  const [currAccount, setCurrAccount] = useState<AccountSimpleList | null>(
    null
  );
  const [currDeleteAccount, setCurrDeleteAccount] =
    useState<AccountSimpleList | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [accountNameSearch, setAccountNameSearch] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const [first, setFirst] = useState<number>(0);
  const {
    accountsList,
    accountDetails,
    loading,
    totalElements,
    handleGetAccounts,
    handleGetAccountById,
    handlePostAccount,
    handleUpdateAccount,
    handleDeleteAccount,
  } = useContext(AccountContext);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onClick: openDialog,
    },
    {
      ariaLabel: "Excluir",
      label: "Excluir",
      onClick: openDeleteDialog,
    },
  ];

  const columnBodyOptions = {
    options: (accountSimpleList: AccountSimpleList) =>
      optionsBodyTemplate(options, accountSimpleList),
  };

  function openDialog(accountSimpleList: AccountSimpleList) {
    setCurrAccount(accountSimpleList);
    setShowDialog(true);
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrAccount(null);
  }

  async function onUpdateAccount(account: AccountSimpleList) {
    await handleUpdateAccount(account);
    handleGetAccounts();
  }

  function openDeleteDialog(account: AccountSimpleList) {
    setCurrDeleteAccount(account);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setCurrDeleteAccount(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  async function onDeleteAccount(accountId: string) {
    await handleDeleteAccount(accountId);
    handleGetAccounts();
  }

  function onSearch(name: string) {
    handleGetAccounts(0, accountNameSearch);
  }

  function onChangeSearch(accountName: string) {
    setAccountNameSearch(accountName);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetAccounts(page);
    setFirst(first);
  }

  async function onCreateAccount(account: AccountDTO) {
    await handlePostAccount(account);
    handleGetAccounts();
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  const favoriteBodyTemplate = (account: AccountSimpleList) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": account.favorite,
          "false-icon pi-times-circle": !account.favorite,
        })}
      ></i>
    );
  };

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Contas Bancárias</h1>
          <InputSearch onSearch={onSearch} onChange={onChangeSearch} />
          <Button
            style={{
              backgroundColor: "var(--cor-primaria)",
              border: "1px solid var(--cor-primaria)",
            }}
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            Adicionar
          </Button>
        </div>
        <DataTable
          emptyMessage="Nenhuma conta encontrada"
          value={accountsList}
          loading={loading}
          stripedRows
          showGridlines
          rows={15}
          totalRecords={totalElements}
          size="small"
          className="smaller-text"
        >
          <Column field="name" header="Nome" />
          <Column field="financialInstitute" header="Instituição Financeira" />
          <Column field="accountNumber" header="Número da Conta" />

          <Column
            field="favorite"
            header="Favorito ?"
            dataType="boolean"
            style={{ minWidth: "6rem" }}
            body={favoriteBodyTemplate}
          />
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        {showCreateDialog && (
          <AccountCreateDialog
            visible={showCreateDialog}
            onCreate={onCreateAccount}
            onHide={closeCreateDialog}
          />
        )}
        {currAccount && (
          <AccountUpdateDialog
            visible={showDialog}
            onUpdate={onUpdateAccount}
            onHide={closeUpdateDialog}
            data={currAccount}
          />
        )}
        {currDeleteAccount && (
          <AccountDeleteDialog
            visible={showDeleteDialog}
            data={currDeleteAccount}
            onDelete={onDeleteAccount}
            onHide={closeDeleteDialog}
          />
        )}
      </section>
    </>
  );

  function optionsBodyTemplate(
    elements: Options[],
    account: AccountSimpleList
  ) {
    return (
      <div className="flex gap-2">
        {elements.map((el, index) => {
          return (
            <Button
              key={index}
              icon={el.icon}
              label={el.label}
              aria-label={el.ariaLabel}
              tooltip={el.tooltip}
              tooltipOptions={{ position: "top", className: "text-xs" }}
              size="small"
              severity="danger"
              onClick={() => el.onClick(account)}
            />
          );
        })}
      </div>
    );
  }
}

export default AccountList;
