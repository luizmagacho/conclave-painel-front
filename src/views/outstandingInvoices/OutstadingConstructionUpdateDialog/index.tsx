import LabelTitle from "@/components/LabelTitle";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import { SupplierContext } from "@/context/SupplierContext";
import { OutstandingInvoices } from "@/services/outstanding-invoices/type";
import { SupplierRecord } from "@/services/supplier/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { useContext, useEffect, useState } from "react";

interface OutstandingInvoicesDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (outstandingInvoices: OutstandingInvoices) => void;
  data: OutstandingInvoices;
}

function OutstandingConstructionUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: OutstandingInvoicesDialog) {
  const userId = localStorage.getItem("portal.id");
  const router = useRouter();
  const [updatedOutstandingInvoices, setUpdatedOutstandingInvoices] =
    useState<OutstandingInvoices>({
      id: data.id,
      name: data.name,
      centerCost: data.centerCost,
      centerCostId: data.centerCostId,
      purchaseDate: data.purchaseDate,
      purchaseDateFormatted: data.purchaseDateFormatted,
      paymentDeadline: data.paymentDeadline,
      paymentDeadlineFormatted: data.paymentDeadlineFormatted,
      bankBranch: data.bankBranch,
      localBank: data.localBank,
      costType: data.costType,
      costCategory: data.costCategory,
      paymentStatus: data.paymentStatus,
      totalAmount: data.totalAmount,
      vendorName: data.vendorName,
      userId: data.userId,
      enabled: data.enabled,
      additionalDetails: data.additionalDetails,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });

  const { allCategories, handleGetAllCategories } = useContext(
    OutstandingInvoicesContext
  );

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord>({
    shortenedName: data.vendorName,
  });

  const { allSuppliersShortenedName } = useContext(SupplierContext);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    data.costCategory
  );
  const [updatedPurchaseDate, setUpdatedPurchaseDate] = useState<Date | null>(
    convertStringToDate(data.purchaseDate)
  );
  const [invalidTotalAmount, setInvalidTotalAmount] = useState<boolean>(false);
  const [updatedPaymentDeadline, setUpdatedPaymentDeadline] =
    useState<Date | null>(convertStringToDate(data.paymentDeadline));
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidCostCategory, setInvalidCostCategory] =
    useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);
  const [
    invalidOutstandingInvoicesCategory,
    setInvalidOutstandingInvoicesCategory,
  ] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      purchaseDate:
        formatDateToYYYYMMDD(updatedPurchaseDate) ||
        prevOutstandingInvoices.purchaseDate,
      paymentDeadline:
        formatDateToYYYYMMDD(updatedPaymentDeadline) ||
        prevOutstandingInvoices.paymentDeadline,
    }));
  }, [updatedPurchaseDate, updatedPaymentDeadline]);

  function validateFields() {
    setUpdatedOutstandingInvoices({
      ...updatedOutstandingInvoices,
      userId: userId || "",
    });
    setInvalidVendorName(
      !updatedOutstandingInvoices.vendorName ||
        updatedOutstandingInvoices.vendorName === ""
    );
    console.log(updatedOutstandingInvoices.totalAmount);
    setInvalidTotalAmount(
      !updatedOutstandingInvoices.totalAmount ||
        updatedOutstandingInvoices.totalAmount < 0
    );

    if (
      (updatedOutstandingInvoices.totalAmount ||
        updatedOutstandingInvoices.totalAmount >= 0) &&
      (updatedOutstandingInvoices.vendorName ||
        updatedOutstandingInvoices.vendorName !== "")
    ) {
      onUpdate(updatedOutstandingInvoices);
      onHide();
    }
  }

  const [allSupplierItems, setAllSupplierItems] = useState<SupplierRecord[]>(
    allSuppliersShortenedName
  );

  const [allCategoryItems, setAllCategoryItems] =
    useState<string[]>(allCategories);

  const supplierSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliersShortenedName];
      } else {
        _filteredSuppliers = allSuppliersShortenedName.filter((supplier) => {
          return supplier.shortenedName
            .toLocaleUpperCase()
            .startsWith(event.query);
        });
      }
      setAllSupplierItems(_filteredSuppliers);
    }, 150);
  };

  const categoriesSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredCategories;
      if (!event.query.trim().length) {
        _filteredCategories = [...allCategories];
      } else {
        _filteredCategories = allCategories.filter((category) => {
          return category
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllCategoryItems(_filteredCategories);
    }, 150);
  };

  useEffect(() => {
    setUpdatedOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,

      costCategory: selectedCategory || prevOutstandingInvoices.costCategory,
    }));
  }, [selectedCategory]);

  useEffect(() => {
    setUpdatedOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      vendorName: selectedSupplier.shortenedName,
    }));
  }, [selectedSupplier]);

  const formatCurrency = (value: number) => {
    if (value === 0) {
      return value;
    }
    if (value) {
      return value / 100;
    }

    return 0;
  };

  return (
    <Dialog
      header="Editar Custo"
      visible={visible}
      onHide={onHide}
      className="w-60rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Favorecido"
            htmlFor="shortenedName"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="shortenedName"
              dropdown
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedSupplier}
              suggestions={allSupplierItems}
              completeMethod={supplierSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setSelectedSupplier(e.value);
                setInvalidVendorName(false);
              }}
            />
            {invalidVendorName && (
              <Message
                severity="error"
                text="Favorecido é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>

        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Vencimento"
            htmlFor="paymentDeadline"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setUpdatedPaymentDeadline(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPaymentDeadline}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidPaymentDeadline && (
            <Message
              severity="error"
              text="Data de Vencimento é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor"
            htmlFor="totalAmount"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedOutstandingInvoices.totalAmount)}
            onChange={(e) => {
              if (e.value !== null) {
                setUpdatedOutstandingInvoices({
                  ...updatedOutstandingInvoices,
                  totalAmount: e.value * 100,
                });
              }
              setInvalidPaymentDeadline(false);
            }}
          />
          {invalidTotalAmount && (
            <Message
              severity="error"
              text="Valor é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Categoria"
            htmlFor="OutstandingInvoicesCategory"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedCategory}
              suggestions={allCategoryItems}
              completeMethod={categoriesSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setSelectedCategory(e.value);
                setInvalidOutstandingInvoicesCategory(false);
              }}
            />
            {invalidOutstandingInvoicesCategory && (
              <Message
                severity="error"
                text="Categoria é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Confirmação de Pagamento"
            htmlFor="paymentStatus"
            className="font-semibold"
          />
          <div className="flex align-items-center gap-2 w-full a">
            <div className="flex">
              <RadioButton
                value={true}
                name="Sim"
                onChange={(e) =>
                  setUpdatedOutstandingInvoices({
                    ...updatedOutstandingInvoices,
                    paymentStatus: e.value,
                  })
                }
                checked={updatedOutstandingInvoices.paymentStatus === true}
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
                  setUpdatedOutstandingInvoices({
                    ...updatedOutstandingInvoices,
                    paymentStatus: e.value,
                  });
                }}
                checked={updatedOutstandingInvoices.paymentStatus === false}
              />
              <label htmlFor="option2" className="ml-2">
                Não
              </label>
            </div>
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="Memo" htmlFor="memo" className="font-semibold" />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedOutstandingInvoices({
                ...updatedOutstandingInvoices,
                additionalDetails: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedOutstandingInvoices?.additionalDetails}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          onClick={() => validateFields()}
          className="w-full"
          label="Salvar"
          severity="danger"
        />
      </div>
    </Dialog>
  );
}

export default OutstandingConstructionUpdateDialog;
