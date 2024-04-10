import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import { AccountContext } from "@/context/AccountContext";
import { PaymentContext } from "@/context/PaymentContext";
import { SupplierContext } from "@/context/SupplierContext";
import { AccountSimpleList } from "@/services/account/type";
import { Payment, PaymentDTO } from "@/services/payment/type";
import { Supplier } from "@/services/supplier/type";
import { formatarData, formatarDataBR, localeBR } from "@/util/date";
import { AutoComplete, AutoCompleteChangeEvent } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import { useContext, useEffect, useState } from "react";
import PaymentCreateForm from "../PaymentCreateForm";
import { classNames } from "primereact/utils";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (payment: Payment) => void;
}

interface OptionType {
  type: string[];
}

function PaymentList() {
  const [currPayment, setCurrPayment] = useState<Payment | null>(null);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: ["Data", "Favorecido"],
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Supplier | null>(null);

  const {
    accountsFavoriteList,
    accountsListNotFavorites,
    handleGetAccountsByFavorite,
  } = useContext(AccountContext);

  const { suppliers } = useContext(SupplierContext);

  const [account, setAccount] = useState<AccountSimpleList>(
    accountsFavoriteList[activeIndex]
  );
  const [finalBalance, setFinalBalance] = useState<string>("");

  const [isOthersAccounts, setIsOthersAccounts] = useState<boolean>(false);

  const {
    paymentsByAccountId,
    loading,
    totalElements,
    handleGetPaymentsByAccountId,
    handlePostPayment,
  } = useContext(PaymentContext);

  useEffect(() => {
    const account = accountsFavoriteList[activeIndex];
    if (activeIndex === accountsFavoriteList.length) {
      handleGetAccountsByFavorite(0, "", false);
      setIsOthersAccounts(true);
    } else {
      setIsOthersAccounts(false);
    }

    if (account) {
      setAccount({ ...account, id: account.id });
      setAccount({ ...account, name: account.name });
      setAccount({ ...account, balance: account.balance });
      setFinalBalance(
        account.balance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
      handleGetPaymentsByAccountId(account.id);
    }
  }, [activeIndex]);

  useEffect(() => {
    const account = accountsFavoriteList[0];
    setIsOthersAccounts(false);
    if (account) {
      setAccount({ ...account, id: account.id });
      setAccount({ ...account, name: account.name });
      setAccount({ ...account, balance: account.balance });
      setFinalBalance(
        account.balance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
      handleGetPaymentsByAccountId(account.id);
    }
  }, [accountsFavoriteList]);

  useEffect(() => {
    localeBR;
    handleGetAccountsByFavorite();
  }, []);

  async function onCreatePayment(payment: PaymentDTO) {
    await handlePostPayment(payment);
    handleGetPaymentsByAccountId(account.id);
  }

  const footerTemplate = () => {
    return (
      <div className="flex gap-2 w-full">
        <div className="flex-grow-1">
          <LabelTitle
            text="Saldo de hoje: R$123,45"
            htmlFor="todayBalance"
            className="font-semibold smaller-text"
          />
        </div>
        <div className="flex-shrink-0">
          <LabelTitle
            text={`Saldo de final: R$ ${finalBalance}`}
            htmlFor="finalBalance"
            className="font-semibold smaller-text"
          />
        </div>
      </div>
    );
  };

  const clearedBodyTemplate = (payment: Payment) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": payment.cleared,
          "false-icon pi-times-circle": !payment.cleared,
        })}
      ></i>
    );
  };

  return (
    <section className="flex flex-column gap-1 p-3 w-full">
      <div className="flex align-items-center justify-start w-full">
        <h2 className="m-0">Pagamentos</h2>
      </div>
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="smaller-text"
      >
        {accountsFavoriteList.map((account) => (
          <TabPanel header={account.name} key={account.id}></TabPanel>
        ))}
        <TabPanel header="Outros"></TabPanel>
      </TabView>
      {isOthersAccounts && (
        <Dropdown
          options={accountsListNotFavorites}
          optionLabel="name"
          emptyMessage="Sem Contas"
        />
      )}

      <DataTable
        emptyMessage="Nenhum pagamento para a conta encontrado"
        value={paymentsByAccountId}
        loading={loading}
        stripedRows
        showGridlines
        selectionMode="single"
        onSelectionChange={(e) => setCurrPayment(e.value)}
        selection={currPayment!}
        rows={10}
        totalRecords={totalElements}
        size="small"
        className="smaller-text"
        footer={footerTemplate}
      >
        <Column
          field="numberCheckTransfer"
          header="Número"
          className="smaller-text"
        />
        <Column
          field="paymentDateFormatted"
          header="Data"
          className="smaller-text"
        />
        <Column
          field="beneficiary"
          header="Favorecido"
          className="smaller-text"
        />
        <Column
          field="cleared"
          header="C"
          className="smaller-text"
          body={clearedBodyTemplate}
        />
        <Column field="withdraw" header="Pagamento" className="smaller-text" />
        <Column field="deposit" header="Depósito" className="smaller-text" />
        <Column field="balance" header="Saldo" className="smaller-text" />
      </DataTable>
      <TabView className="w-full smaller-text">
        <TabPanel header="Cheque">
          {account && (
            <PaymentCreateForm
              accountId={account.id}
              accountName={account.name}
              onCreate={onCreatePayment}
              paymentType="CHECK"
            />
          )}
        </TabPanel>
        <TabPanel header="Depósito">
          {account && (
            <PaymentCreateForm
              accountId={account.id}
              accountName={account.name}
              onCreate={onCreatePayment}
              paymentType="DEPOSIT"
            />
          )}
        </TabPanel>
        <TabPanel header="Transferência">
          {account && (
            <PaymentCreateForm
              accountId={account.id}
              accountName={account.name}
              onCreate={onCreatePayment}
              paymentType="TRANSFER"
            />
          )}
        </TabPanel>
        <TabPanel header="Retirada">
          {account && (
            <PaymentCreateForm
              accountId={account.id}
              accountName={account.name}
              onCreate={onCreatePayment}
              paymentType="WITHDRAW"
            />
          )}
        </TabPanel>
        <TabPanel header="Ret. em dinheiro">
          {account && (
            <PaymentCreateForm
              accountId={account.id}
              accountName={account.name}
              onCreate={onCreatePayment}
              paymentType="MONEYWITHDRAW"
            />
          )}
        </TabPanel>
      </TabView>
    </section>
  );
}

export default PaymentList;
