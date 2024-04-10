import LabelTitle from "@/components/LabelTitle";
import { SupplierContext } from "@/context/SupplierContext";
import { PaymentDTO } from "@/services/payment/type";
import { Supplier } from "@/services/supplier/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface PaymentCreateForm {
  accountId: number;
  accountName: string;
  onCreate: (payment: PaymentDTO) => void;
  paymentType: string;
}

function PaymentCreateForm({
  accountId,
  accountName,
  onCreate,
  paymentType,
}: PaymentCreateForm) {
  const [newPayment, setNewPayment] = useState<PaymentDTO>({
    accountId: accountId,
    balance: null,
    cleared: false,
    beneficiary: "",
    beneficiaryId: null,
    deposit: null,
    withdraw: null,
    enabled: true,
    numberCheckTransfer: "",
    description: "",
    paymentDate: new Date(),
  });
  const [invalidBeneficiary, setInvalidBeneficiary] = useState<boolean>(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Supplier | null>(null);
  const [newPaymentDate, setNewPaymentDate] = useState<Date | null>();

  const { allSuppliers, handleGetAllSuppliers } = useContext(SupplierContext);

  const [allSupplierItems, setAllSupplierItems] =
    useState<Supplier[]>(allSuppliers);

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
          return supplier.shortenedName.startsWith(
            event.query.toLocaleUpperCase()
          );
        });
      }
      setAllSupplierItems(_filteredSuppliers);
    }, 150);
  };

  useEffect(() => {
    handleGetAllSuppliers();
  }, []);

  useEffect(() => {
    console.log("Favorecido: ", selectedBeneficiary?.shortenedName);

    setNewPayment((prevPayment) => ({
      ...prevPayment,
      beneficiaryId: selectedBeneficiary?.id || prevPayment.beneficiaryId,
    }));
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      beneficiary:
        selectedBeneficiary?.shortenedName || prevPayment.beneficiary,
    }));
  }, [selectedBeneficiary]);

  async function validateFields() {
    console.log(newPayment.beneficiary);
    setInvalidBeneficiary(
      !newPayment.beneficiary || newPayment.beneficiary === ""
    );
    if (!invalidBeneficiary) {
      await onCreate(newPayment);
      setSelectedBeneficiary(null);
      setNewPayment({
        accountId: accountId,
        balance: null,
        cleared: false,
        beneficiary: "",
        beneficiaryId: null,
        deposit: null,
        withdraw: null,
        enabled: true,
        numberCheckTransfer: "",
        description: "",
        paymentDate: null,
      });
    }
  }

  return (
    <div>
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
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Número"
            htmlFor="number"
            className="font-semibold smaller-text"
          />
          <InputText
            type="number"
            style={{ height: "30px", fontSize: "0.8rem" }}
            onChange={(e) => {
              setNewPayment({
                ...newPayment,
                numberCheckTransfer: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-column md:flex-row gap-2 w-11/12">
        <div className="field flex flex-column gap-1 w-full">
          <LabelTitle
            text="Categoria:"
            htmlFor="payTo"
            className="font-semibold smaller-text"
          />
          <div className="flex flex-column md:flex-row gap-2 w-11/12">
            <div className="field flex flex-column gap-1 w-full">
              <Dropdown
                className="flex-grow"
                style={{ height: "30px", fontSize: "0.8rem" }}
              />
            </div>
            <div className="field flex flex-column gap-1 w-full">
              <Dropdown
                className="flex-grow"
                style={{ height: "30px", fontSize: "0.8rem" }}
              />
            </div>
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text=" "
              htmlFor="payTo"
              className="font-semibold smaller-text"
            />
            <Button
              severity="danger"
              className="flex-grow"
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
          </div>
        </div>
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
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Montante"
              htmlFor="withdraw"
              className="font-semibold smaller-text"
            />
            {paymentType === "WITHDRAW" ||
              (paymentType === "MONEYWITHDRAW" && (
                <InputNumber
                  inputId="currency-br"
                  mode="currency"
                  locale="pt-BR"
                  currency="BRL"
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  value={newPayment?.withdraw}
                  onChange={(e) => {
                    setNewPayment({ ...newPayment, withdraw: e.value });
                  }}
                />
              ))}
            {paymentType === "DEPOSIT" && (
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                className="smaller-text"
                value={newPayment?.deposit}
                onChange={(e) => {
                  setNewPayment({ ...newPayment, deposit: e.value });
                }}
              />
            )}
          </div>
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
          label={
            paymentType === "WITHDRAW"
              ? "Retirar"
              : paymentType === "DEPOSIT"
              ? "Depositar"
              : paymentType === "MONEYWITHDRAW"
              ? "Retirada em Dinheiro"
              : "Transferência"
          }
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </div>
  );
}

export default PaymentCreateForm;
