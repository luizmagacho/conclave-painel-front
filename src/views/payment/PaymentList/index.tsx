import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import { AccountContext } from "@/context/AccountContext";
import { PaymentContext } from "@/context/PaymentContext";
import { SupplierContext } from "@/context/SupplierContext";
import { AccountSimpleList } from "@/services/account/type";
import { Payment, PaymentDTO } from "@/services/payment/type";
import { Supplier } from "@/services/supplier/type";
import { localeBR } from "@/util/date";
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

  const { accountsList } = useContext(AccountContext);

  const { suppliers } = useContext(SupplierContext);

  const [account, setAccount] = useState<AccountSimpleList>(
    accountsList[activeIndex]
  );

  const {
    paymentsByAccountId,
    loading,
    totalElements,
    handleGetPaymentsByAccountId,
    handlePostPayment,
  } = useContext(PaymentContext);

  useEffect(() => {
    const account = accountsList[activeIndex];
    console.log(account);
    if (account) {
      setAccount({ ...account, id: account.id });
      setAccount({ ...account, name: account.name });
      handleGetPaymentsByAccountId(account.id);
    }
  }, [activeIndex]);

  useEffect(() => {
    const account = accountsList[0];
    console.log(account);
    if (account) {
      setAccount({ ...account, id: account.id });
      setAccount({ ...account, name: account.name });
      handleGetPaymentsByAccountId(account.id);
    }
  }, [accountsList]);

  useEffect(() => {
    localeBR;
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
            className="font-semibold"
          />
        </div>
        <div className="flex-shrink-0">
          <LabelTitle
            text="Saldo de final: R$123,45"
            htmlFor="finalBalance"
            className="font-semibold"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="flex flex-column gap-2 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Pagamentos</h1>
        </div>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {accountsList.map((account) => (
            <TabPanel header={account.name} key={account.id}></TabPanel>
          ))}
        </TabView>
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
          footer={footerTemplate}
        >
          <Column field="numberCheckTransfer" header="Número" />
          <Column field="paymentDate" header="Data" />
          <Column field="beneficiary" header="Favorecido" />
          <Column field="cleared" header="C" />
          <Column field="withdraw" header="Pagamento" />
          <Column field="deposit" header="Depósito" />
          <Column field="balance" header="Saldo" />
        </DataTable>
        <TabView className="w-full">
          <TabPanel header="Cheque"></TabPanel>
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
          <TabPanel header="Transferência"></TabPanel>
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
          <TabPanel header="Ret. em dinheiro"></TabPanel>
        </TabView>
      </section>
    </>
  );
}

export default PaymentList;
