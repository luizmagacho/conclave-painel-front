import LabelTitle from "@/components/LabelTitle";
import { SupplierContext } from "@/context/SupplierContext";
import { PaymentDTO } from "@/services/payment/type";
import { Supplier } from "@/services/supplier/type";
import { convertStringToDate } from "@/util/date";
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
    deposit: null,
    withdraw: null,
    enabled: true,
    numberCheckTransfer: "",
    description: "",
    paymentDate: new Date(),
  });
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

  return (
    <div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Pagar a:"
            htmlFor="payTo"
            className="font-semibold text-sm"
          />
          <AutoComplete
            suggestions={allSupplierItems}
            field="shortenedName"
            dropdown
            value={selectedBeneficiary}
            completeMethod={suppliersSearch}
            onChange={(e: AutoCompleteChangeEvent) => {
              setSelectedBeneficiary(e.value);
              setNewPayment({ ...newPayment, beneficiary: e.value });
            }}
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Número"
            htmlFor="number"
            className="font-semibold text-sm"
          />
          <InputText
            type="number"
            onChange={(e) => {
              setNewPayment({
                ...newPayment,
                numberCheckTransfer: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Categoria:"
            htmlFor="payTo"
            className="font-semibold text-sm"
          />
          <div className="card flex flex-column md:flex-row gap-2 w-11/12">
            <div className="field flex flex-column gap-2 w-full">
              <Dropdown className="flex-grow" />
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <Dropdown className="flex-grow" />
            </div>
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text=" "
              htmlFor="payTo"
              className="font-semibold text-sm"
            />
            <Button severity="danger" className="flex-grow" />
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data"
            htmlFor="paymentDate"
            className="font-semibold text-sm"
          />
          <Calendar
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
            onChange={(e) => {
              setNewPaymentDate(e.value || null);
            }}
          />
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Montante"
              htmlFor="withdraw"
              className="font-semibold text-sm"
            />
            {paymentType === "WITHDRAW" && (
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                value={newPayment?.withdraw}
                onChange={(e) => {
                  setNewPayment({ ...newPayment, withdraw: e.value });
                }}
              />
            )}
            {paymentType === "DEPOSIT" && (
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                value={newPayment?.deposit}
                onChange={(e) => {
                  setNewPayment({ ...newPayment, deposit: e.value });
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Memo: "
            htmlFor="memo"
            className="font-semibold text-sm"
          />
          <InputText
            type="text"
            className="flex-grow"
            value={newPayment.description}
            onChange={(e) => {
              setNewPayment({ ...newPayment, description: e.target.value });
            }}
          />
        </div>
      </div>
      <Divider />
      <div
        className="flex justify-end gap-6 w-full"
        style={{ justifyContent: "end" }}
      >
        <Button
          className="rounded-md px-3 text-sm"
          label={paymentType === "WITHDRAW" ? "Retirar" : "Depositar"}
          severity="danger"
        />
      </div>
    </div>
  );
}

export default PaymentCreateForm;
