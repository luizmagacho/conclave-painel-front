import LabelTitle from "@/components/LabelTitle";
import { AccountContext } from "@/context/AccountContext";
import { PaymentContext } from "@/context/PaymentContext";
import { AccountSimpleList } from "@/services/account/type";
import {
  FrequencyType,
  Payment,
  PaymentDTO,
  SearchType,
  TransactionTypeEnum,
  Week,
} from "@/services/payment/type";
import { formatDateToYYYYMMDD, getPreviousYears, localeBR } from "@/util/date";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import { useContext, useEffect, useState } from "react";
import PaymentCreateForm from "../PaymentCreateForm";
import { classNames } from "primereact/utils";
import PaymentTransferCreateForm from "../PaymentTransferCreateForm";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { ScrollPanel } from "primereact/scrollpanel";

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

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [accountNotFavorite, setAccountNotFavorite] =
    useState<AccountSimpleList | null>();

  const [todayBalance, setTodayBalance] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const {
    accountsFavoriteList,
    accountsListNotFavorites,
    accountDetails,
    handleGetAccountsByFavorite,
    handleGetAccountById,
  } = useContext(AccountContext);

  const [account, setAccount] = useState<AccountSimpleList>(
    accountsFavoriteList[activeIndex]
  );
  const [finalBalance, setFinalBalance] = useState<string>("");

  const [isOthersAccounts, setIsOthersAccounts] = useState<boolean>(false);

  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);

  const {
    paymentsByAccountId,
    frequencyTypes,
    weeksOfTheYear,
    loading,
    totalElements,
    handleGetPaymentsByAccountId,
    handlePostPayment,
    handleGetTransactionTypes,
    handleGetFrequencyTypes,
    handleGetWeeksOfTheYear,
  } = useContext(PaymentContext);

  const [first, setFirst] = useState<number>(0);

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetPaymentsByAccountId(account.id, page);
    setFirst(first);
  }
  type TransactionOption = {
    name: string; // Display name for the dropdown option
    value: TransactionTypeEnum; // Corresponding enum value
  };

  const transactionsTypes: TransactionOption[] = [
    { name: "Todos Tipos de Transição", value: TransactionTypeEnum.ALLOPTIONS },
    { name: "Depósito", value: TransactionTypeEnum.DEPOSIT },
    { name: "Transferência", value: TransactionTypeEnum.TRANSFER },
    { name: "Retirada", value: TransactionTypeEnum.WITHDRAW },
    { name: "Ret. em Dinheiro", value: TransactionTypeEnum.MONEYWITHDRAW },
  ];

  const [selectedTransactionSearch, setSelectedTransactionSearch] = useState<
    string | null
  >(transactionsTypes[0].value);

  const [selectedFrequencySearch, setSelectedFrequencySearch] =
    useState<FrequencyType | null>(frequencyTypes[0]);

  const [selectedWeekSearch, setSelectedWeekSearch] = useState<Week | null>();

  const formatCurrency = (value: number | null) => {
    if (!value) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    const account = accountsFavoriteList[activeIndex];
    setAccountNotFavorite(null);
    if (activeIndex === accountsFavoriteList.length) {
      handleGetAccountsByFavorite(0, "", false);
      setIsOthersAccounts(true);
    } else {
      setIsOthersAccounts(false);
    }

    if (account) {
      handleGetAccountById(account.id);
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
      handleGetAccountById(account.id);
      setAccount({ ...account, id: account.id });
      setAccount({ ...account, name: account.name });
      setAccount({ ...account, balance: account.balance });
      setFinalBalance(
        account.balance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
      handleGetPaymentsByAccountId(
        account.id,
        0,
        SearchType.CENTERCOST,
        TransactionTypeEnum.ALLOPTIONS,
        null,
        "",
        formatDateToYYYYMMDD(new Date()) || ""
      );
    }
  }, [accountsFavoriteList]);

  useEffect(() => {
    if (paymentsByAccountId) {
      const todayBalance = paymentsByAccountId.reduce((acc, payment) => {
        return acc + payment.deposit - payment.withdraw;
      }, 0);
      setTodayBalance(todayBalance);
    }
  }, [paymentsByAccountId]);

  useEffect(() => {
    localeBR;
    handleGetAccountsByFavorite();
    handleGetTransactionTypes();
    handleGetFrequencyTypes();
  }, []);

  useEffect(() => {
    setSelectedFrequencySearch(frequencyTypes[0]);
  }, [frequencyTypes]);

  useEffect(() => {
    if (selectedFrequencySearch?.name === "Semanal") {
      handleGetWeeksOfTheYear(selectedYear);
    }
  }, [selectedFrequencySearch]);

  useEffect(() => {
    handleGetWeeksOfTheYear(selectedYear);
  }, [selectedYear]);

  const priceDepositBodyTemplate = (payment: PaymentDTO) => {
    return formatCurrency(payment.deposit || null);
  };

  const priceWithdrawBodyTemplate = (payment: PaymentDTO) => {
    return formatCurrency(payment.withdraw || null);
  };

  const priceBalanceBodyTemplate = (payment: PaymentDTO) => {
    return formatCurrency(payment.balance || null);
  };

  async function onCreatePayment(payment: PaymentDTO) {
    await handlePostPayment(payment);
    const selectedOption = transactionsTypes.find(
      (option) => option.value === selectedTransactionSearch
    );
    const enumValue = selectedOption?.value;
    handleGetPaymentsByAccountId(
      account.id,
      0,
      SearchType.CENTERCOST,
      enumValue
    );
    handleGetAccountById(account.id);
  }

  async function onChangeNotFavoriteAccount(
    accountNotFavorite: AccountSimpleList
  ) {
    const selectedOption = transactionsTypes.find(
      (option) => option.value === selectedTransactionSearch
    );
    const enumValue = selectedOption?.value;
    await handleGetPaymentsByAccountId(
      accountNotFavorite.id,
      0,
      SearchType.CENTERCOST,
      enumValue,
      null,
      "",
      "",
      selectedWeekSearch?.number
    );
  }

  async function onChangeTransactionType(transactionType: string) {
    const selectedOption = transactionsTypes.find(
      (option) => option.value === transactionType
    );
    const enumValue = selectedOption?.value;
    setSelectedTransactionSearch(transactionType);
    await handleGetPaymentsByAccountId(
      account.id,
      0,
      SearchType.CENTERCOST,
      enumValue,
      null,
      "",
      "",
      selectedWeekSearch?.number
    );
  }

  async function onChangeFrequency(newDate: Date) {
    const selectedOption = transactionsTypes.find(
      (option) => option.value === selectedTransactionSearch
    );
    const enumValue = selectedOption?.value;
    await handleGetPaymentsByAccountId(
      account.id,
      0,
      SearchType.CENTERCOST,
      enumValue,
      null,
      "",
      formatDateToYYYYMMDD(newDate) || ""
    );
  }

  async function onChangeWeekAndYear(week: Week) {
    const selectedOption = transactionsTypes.find(
      (option) => option.value === selectedTransactionSearch
    );
    const enumValue = selectedOption?.value;
    await handleGetPaymentsByAccountId(
      account.id,
      0,
      SearchType.CENTERCOST,
      enumValue,
      null,
      "",
      "",
      week.number
    );
  }

  useEffect(() => {
    if (dateFrom && dateTo) {
      const selectedOption = transactionsTypes.find(
        (option) => option.value === selectedTransactionSearch
      );
      const enumValue = selectedOption?.value;
      handleGetPaymentsByAccountId(
        account.id,
        0,
        SearchType.CENTERCOST,
        enumValue,
        null,
        "",
        "",
        null,
        formatDateToYYYYMMDD(dateFrom) || "",
        formatDateToYYYYMMDD(dateTo) || ""
      );
    }
  }, [dateFrom, dateTo]);

  const footerTemplate = () => {
    return (
      <div className="flex gap-2 w-full">
        <div className="flex-grow-1">
          <LabelTitle
            text={`Saldo de hoje: ${formatCurrency(todayBalance)}`}
            htmlFor="todayBalance"
            className="font-semibold smaller-text"
          />
        </div>
        <div className="flex-shrink-0">
          <LabelTitle
            text={`Saldo de final: ${formatCurrency(
              accountDetails?.balance || null
            )}`}
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
    <ScrollPanel style={{ width: "100%", height: "100vh" }}>
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
            value={accountNotFavorite}
            optionLabel="name"
            emptyMessage="Sem Contas"
            onChange={(e: DropdownChangeEvent) => {
              onChangeNotFavoriteAccount(e.value);
              setAccountNotFavorite(e.value);
            }}
          />
        )}
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Tipo de Transação"
              htmlFor="transactionType"
              className="font-semibold smaller-text"
            />
            <Dropdown
              options={transactionsTypes}
              emptyMessage="Sem tipos de transação"
              optionLabel="name"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedTransactionSearch}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedTransactionSearch(e.value);
                onChangeTransactionType(e.value);
              }}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Periocidade"
              htmlFor="periocity"
              className="font-semibold smaller-text"
            />
            <Dropdown
              options={frequencyTypes}
              optionLabel="name"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedFrequencySearch}
              onChange={(e: DropdownChangeEvent) =>
                setSelectedFrequencySearch(e.value)
              }
            />
          </div>
          {selectedFrequencySearch?.name === "Diário" && (
            <div className="field flex flex-column gap-1 w-full">
              <LabelTitle
                text="Data"
                htmlFor="periocity"
                className="font-semibold smaller-text"
              />
              <Calendar
                locale="pt"
                className="ui-state-default"
                dateFormat="dd/mm/yy"
                style={{ height: "30px", fontSize: "0.8rem" }}
                showIcon
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.value || new Date());
                  onChangeFrequency(e.value || new Date());
                }}
              />
            </div>
          )}
          {selectedFrequencySearch?.name === "Semanal" && (
            <>
              <div className="field flex flex-column gap-1 w-full">
                <LabelTitle
                  text="Semana"
                  htmlFor="periocity"
                  className="font-semibold smaller-text"
                />
                <Dropdown
                  options={weeksOfTheYear}
                  optionLabel="weekName"
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  value={selectedWeekSearch}
                  onChange={(e: DropdownChangeEvent) => {
                    setSelectedWeekSearch(e.value);
                    onChangeWeekAndYear(e.value || null);
                  }}
                />
              </div>
              <div className="field flex flex-column gap-1 w-full">
                <LabelTitle
                  text="Ano"
                  htmlFor="yearFrequency"
                  className="font-semibold smaller-text"
                />
                <Dropdown
                  options={getPreviousYears()}
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  value={selectedYear}
                  onChange={(e: DropdownChangeEvent) =>
                    setSelectedYear(e.value)
                  }
                />
              </div>
            </>
          )}
          {selectedFrequencySearch?.name === "Período de Datas" && (
            <>
              <div className="field flex flex-column gap-1 w-full">
                <LabelTitle
                  text="De"
                  htmlFor="fromDate"
                  className="font-semibold smaller-text"
                />
                <Calendar
                  locale="pt"
                  className="ui-state-default"
                  dateFormat="dd/mm/yy"
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  showIcon
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.value || null);
                  }}
                />
              </div>
              <div className="field flex flex-column gap-1 w-full">
                <LabelTitle
                  text="Até"
                  htmlFor="toDate"
                  className="font-semibold smaller-text"
                />
                <Calendar
                  locale="pt"
                  className="ui-state-default"
                  dateFormat="dd/mm/yy"
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  showIcon
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.value || null);
                  }}
                />
              </div>
            </>
          )}
        </div>

        <DataTable
          emptyMessage="Nenhum pagamento para a conta encontrado"
          value={paymentsByAccountId}
          loading={loading}
          stripedRows
          showGridlines
          scrollable
          scrollHeight="300px"
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
          <Column
            field="withdraw"
            header="Pagamento"
            body={priceWithdrawBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="deposit"
            header="Depósito"
            body={priceDepositBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="balance"
            header="Saldo"
            body={priceBalanceBodyTemplate}
            className="smaller-text"
          />
        </DataTable>
        <Paginator
          first={first}
          rows={5}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />

        <TabView className="w-full smaller-text">
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
              <PaymentTransferCreateForm
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
    </ScrollPanel>
  );
}

export default PaymentList;
