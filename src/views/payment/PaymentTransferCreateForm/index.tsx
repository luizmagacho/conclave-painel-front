import LabelTitle from "@/components/LabelTitle";
import { AccountContext } from "@/context/AccountContext";
import { ConstructionContext } from "@/context/ConstructionContext";
import { PaymentContext } from "@/context/PaymentContext";
import { SupplierContext } from "@/context/SupplierContext";
import { AccountSimpleList } from "@/services/account/type";
import { Construction } from "@/services/construction/type";
import { PaymentDTO } from "@/services/payment/type";
import { Supplier } from "@/services/supplier/type";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface PaymentTransferCreateForm {
  accountId: string;
  accountName: string;
  onCreate: (payment: PaymentDTO) => void;
  paymentType: string;
}

function PaymentTransferCreateForm({
  accountId,
  accountName,
  onCreate,
  paymentType,
}: PaymentTransferCreateForm) {
  const [newPayment, setNewPayment] = useState<PaymentDTO>({
    accountId: accountId,
    centerCostId: "",
    centerCost: "",
    bankBranchLocalBank: "",
    accountIdTo: null,
    balance: null,
    cleared: false,
    beneficiary: "",
    beneficiaryId: null,
    category: "",
    categoryId: null,
    subCategory: "",
    subCategoryId: null,
    deposit: null,
    withdraw: null,
    transactionType: paymentType,
    enabled: true,
    numberCheckTransfer: "",
    description: "",
    paymentDate: new Date(),
  });
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Supplier | null>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountSimpleList | null>(null);
  const [invalidBeneficiary, setInvalidBeneficiary] = useState<boolean>(false);
  const [invalidAccount, setInvalidAccount] = useState<boolean>(false);
  const [invalidDate, setInvalidDate] = useState<boolean>(false);
  const [invalidValue, setInvalidValue] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);
  const [newPaymentDate, setNewPaymentDate] = useState<Date | null>();
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const { allSuppliers, handleGetAllSuppliers } = useContext(SupplierContext);
  const {
    accountsList,
    accountsFavoriteList,
    accountsListNotFavorites,
    handleGetAccountsByFavorite,
  } = useContext(AccountContext);
  const {
    allCategories,
    allSubCategories,
    handleGetCategories,
    handlePostCategory,
    handleGetSubCategories,
    handlePostSubCategory,
  } = useContext(PaymentContext);

  const [allSupplierItems, setAllSupplierItems] =
    useState<Supplier[]>(allSuppliers);

  const [allAccountsItems, setAllAccountsItems] =
    useState<AccountSimpleList[]>(accountsList);

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      paymentDate: newPaymentDate || prevPayment.paymentDate,
    }));
  }, [newPaymentDate]);

  const suppliersSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliers];
      } else {
        _filteredSuppliers = allSuppliers.filter((supplier) => {
          return supplier.shortenedName
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllSupplierItems(_filteredSuppliers);
    }, 150);
  };

  const accountsSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredAccounts;
      if (!event.query.trim().length) {
        _filteredAccounts = [...accountsList];
      } else {
        _filteredAccounts = accountsList.filter((account) => {
          return account.name
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllAccountsItems(_filteredAccounts);
    }, 150);
  };

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);
  useEffect(() => {
    setConstructionsItems(allConstructions);
  }, [allConstructions]);

  const constructionSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredConstructions;
      if (!event.query.trim().length) {
        _filteredConstructions = [...allConstructions];
      } else {
        _filteredConstructions = constructionsItems.filter((construction) => {
          return construction.code.startsWith(event.query);
        });
      }
      setConstructionsItems(_filteredConstructions);
    }, 150);
  };

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      centerCostId: selectedConstruction?.id || "",
      centerCost: selectedConstruction?.code || "",
      bankBranchLocalBank: selectedConstruction?.bankBranch
        ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
        : "" || "",

      typeCenterCost: selectedConstruction?.service || "",
      payer: selectedConstruction?.client || "",
    }));
  }, [selectedConstruction]);

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      beneficiaryId: selectedBeneficiary?.id || prevPayment.beneficiaryId,
      beneficiary:
        selectedBeneficiary?.shortenedName || prevPayment.beneficiary,
      accountIdTo: selectedAccount?.id || prevPayment.accountIdTo,
    }));
  }, [selectedBeneficiary, selectedAccount]);

  async function validateFields() {
    setInvalidBeneficiary(
      !newPayment.beneficiary || newPayment.beneficiary === ""
    );
    setInvalidAccount(!newPayment.accountId || newPayment.accountId === null);
    setInvalidDate(!newPayment.paymentDate || newPayment.paymentDate === null);
    setInvalidValue(!newPayment.withdraw || newPayment.withdraw === null);
    if (newPayment.withdraw) {
      setNewPayment({ ...newPayment, withdraw: newPayment.withdraw });
    }
    if (newPayment.deposit) {
      setNewPayment({ ...newPayment, deposit: newPayment.deposit });
    }
    if (!invalidBeneficiary || !invalidDate || !invalidValue) {
      await onCreate(newPayment);
      setSelectedBeneficiary(null);
      setSelectedAccount(null);
      setNewPaymentDate(new Date());
      setNewPayment({
        accountId: accountId,
        centerCostId: "",
        centerCost: "",
        bankBranchLocalBank: "",
        accountIdTo: null,
        balance: null,
        cleared: false,
        beneficiary: "",
        beneficiaryId: null,
        category: "",
        categoryId: null,
        subCategory: "",
        subCategoryId: null,
        deposit: null,
        withdraw: null,
        transactionType: paymentType,
        enabled: true,
        numberCheckTransfer: "",
        description: "",
        paymentDate: null,
      });
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  return (
    <div>
      <div>
        <div className="card flex flex-column md:flex-row gap-2 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Código da Obra"
              htmlFor="constructionCode"
              className="font-semibold"
            />
            <div className="card p-fluid">
              <AutoComplete
                type="text"
                field="code"
                dropdown
                value={selectedConstruction}
                suggestions={constructionsItems}
                completeMethod={constructionSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedConstruction(e.value);
                  setInvalidConstructionCode(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                forceSelection
              />
              {invalidConstructionCode && (
                <Message
                  severity="error"
                  text="Obra é obrigatório"
                  className="smaller-text"
                />
              )}
            </div>
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome da Obra"
              htmlFor="bankBranchLocalBank"
              className="font-semibold"
            />
            <InputText
              type="text"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={newPayment?.bankBranchLocalBank}
              disabled
            />
          </div>
        </div>
        <div className="field flex flex-column gap-1 w-full">
          <LabelTitle
            text="De:"
            htmlFor="from"
            className="font-semibold smaller-text"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            disabled
            value={accountName}
          />
        </div>
        <div className="field flex flex-column gap-1 w-full">
          <LabelTitle
            text="Para:"
            htmlFor="to"
            className="font-semibold smaller-text"
          />
          <AutoComplete
            suggestions={allAccountsItems}
            field="name"
            dropdown
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={selectedAccount}
            completeMethod={accountsSearch}
            onChange={(e: AutoCompleteChangeEvent) => {
              setSelectedAccount(e.value);

              setInvalidAccount(false);
            }}
          />
          {invalidAccount && (
            <Message
              severity="error"
              text="Conta é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="field flex flex-column gap-1 w-full">
          <LabelTitle
            text="Pagar a:"
            htmlFor="payTo"
            className="font-semibold smaller-text"
          />
          <AutoComplete
            suggestions={allSupplierItems}
            field="shortenedName"
            dropdown
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={selectedBeneficiary}
            completeMethod={suppliersSearch}
            onChange={(e: AutoCompleteChangeEvent) => {
              setSelectedBeneficiary(e.value);

              setInvalidBeneficiary(false);
            }}
          />
          {invalidBeneficiary && (
            <Message
              severity="error"
              text="Favorecido é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="flex-column gap-1 w-full">
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Data"
              htmlFor="paymentDate"
              className="font-semibold smaller-text"
            />
            <Calendar
              locale="pt"
              className="ui-state-default"
              dateFormat="dd/mm/yy"
              style={{ height: "30px", fontSize: "0.8rem" }}
              showIcon
              onChange={(e) => {
                setNewPaymentDate(e.value || null);
              }}
            />
            {invalidDate && (
              <Message
                severity="error"
                text="Data é obrigatória"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Montante"
            htmlFor="withdraw"
            className="font-semibold smaller-text"
          />
          {paymentType === "TRANSFER" && (
            <>
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(newPayment?.withdraw)}
                onChange={(e) => {
                  if (e.value) {
                    setNewPayment({ ...newPayment, withdraw: e.value * 100 });
                  }
                }}
              />
              {invalidValue && (
                <Message
                  severity="error"
                  text="Montante é obrigatório"
                  className="smaller-text"
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="field flex flex-column gap-2 w-full">
        <LabelTitle
          text="Memo: "
          htmlFor="memo"
          className="font-semibold smaller-text"
        />
        <InputText
          type="text"
          className="flex-grow smaller-text"
          value={newPayment.description}
          onChange={(e) => {
            setNewPayment({ ...newPayment, description: e.target.value });
          }}
        />
      </div>
      <div
        className="flex justify-end gap-6 w-full"
        style={{ justifyContent: "end" }}
      >
        <Button
          className="rounded-md px-3 smaller-text"
          label="Transferência"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </div>
  );
}

export default PaymentTransferCreateForm;
