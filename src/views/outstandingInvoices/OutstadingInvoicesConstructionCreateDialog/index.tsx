import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { OutstandingInvoicesDTO } from "@/services/outstanding-invoices/type";
import { SupplierRecord } from "@/services/supplier/type";
import { formatDateToYYYYMMDD } from "@/util/date";
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

interface OutstadingInvoicesConstructionCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (outstadingInvoice: OutstandingInvoicesDTO) => void;
}

function OutstadingInvoicesConstructionCreateDialog({
  visible,
  onCreate,
  onHide,
}: OutstadingInvoicesConstructionCreateDialog) {
  const router = useRouter();
  const { selectedConstruction } = useContext(ConstructionContext);
  const userId = localStorage.getItem("portal.id");
  const [newOutstandingInvoices, setNewOutstandingInvoices] =
    useState<OutstandingInvoicesDTO>({
      name: "",
      vendorName: "",
      centerCost: "",
      centerCostId: "",
      bankBranch: "",
      costType: "",
      costCategory: "FORNECEDOR : MATERIAIS",
      localBank: "",
      purchaseDate: "",
      paymentDeadline: "",
      totalAmount: 0,
      userId: localStorage.getItem("portal.id") as string,
      enabled: true,
      additionalDetails: "",
      paymentStatus: false,
    });

  const [selectedConstructionCreate, setSelectedConstructionCreate] =
    useState<Construction | null>(selectedConstruction);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "FORNECEDOR : MATERIAIS"
  );
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord>();
  const [newPurchaseDate, setNewPurchaseDate] = useState<Date | null>(null);

  const [newPaymentDeadline, setNewPaymentDeadline] = useState<Date | null>(
    null
  );
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidTotalAmount, setInvalidTotalAmount] = useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);
  const [
    invalidOutstandingInvoicesCategory,
    setInvalidOutstandingInvoicesCategory,
  ] = useState<boolean>(false);

  useEffect(() => {
    setNewOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      purchaseDate:
        formatDateToYYYYMMDD(newPurchaseDate) ||
        prevOutstandingInvoices.purchaseDate,
      paymentDeadline:
        formatDateToYYYYMMDD(newPaymentDeadline) ||
        prevOutstandingInvoices.paymentDeadline,
    }));
  }, [newPurchaseDate, newPaymentDeadline]);

  function validateFields() {
    setNewOutstandingInvoices({
      ...newOutstandingInvoices,
      userId: userId || "",
    });
    setInvalidVendorName(newOutstandingInvoices.vendorName === "");
    setInvalidTotalAmount(!newOutstandingInvoices.totalAmount);
    if (
      (newOutstandingInvoices.totalAmount ||
        newOutstandingInvoices.totalAmount !== null) &&
      newOutstandingInvoices.vendorName !== ""
    ) {
      onCreate(newOutstandingInvoices);
      onHide();
    }
  }

  const { allSuppliersShortenedName, handleGetAllShortenedName } =
    useContext(SupplierContext);

  const {
    allCategories,
    latestAdditionalDetails,
    handleGetLatestAdditionalDetails,
    handleGetAllCategories,
  } = useContext(OutstandingInvoicesContext);

  const [allSupplierItems, setAllSupplierItems] = useState<SupplierRecord[]>(
    allSuppliersShortenedName
  );

  const [allCategoryItems, setAllCategoryItems] =
    useState<string[]>(allCategories);

  useEffect(() => {
    setAllSupplierItems(allSuppliersShortenedName);
  }, [allSuppliersShortenedName]);

  useEffect(() => {
    setAllCategoryItems(allCategories);
  }, [allCategories]);

  useEffect(() => {
    handleGetAllShortenedName();
    handleGetAllCategories();
  }, []);

  const suppliersSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliersShortenedName];
      } else {
        _filteredSuppliers = allSuppliersShortenedName.filter((supplier) => {
          return supplier.shortenedName
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
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
    setNewOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      centerCostId:
        selectedConstruction?.id || prevOutstandingInvoices.centerCostId,
      centerCost:
        selectedConstruction?.code || prevOutstandingInvoices.centerCost,
      bankBranch:
        selectedConstruction?.bankBranch || prevOutstandingInvoices.bankBranch,
      localBank:
        selectedConstruction?.local || prevOutstandingInvoices.localBank,
      costCategory: selectedCategory || prevOutstandingInvoices.costCategory,
      vendorName:
        selectedSupplier?.shortenedName || prevOutstandingInvoices.vendorName,
    }));
  }, [selectedSupplier, selectedCategory, selectedConstruction]);

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return 0;
  };

  useEffect(() => {
    if (newOutstandingInvoices.vendorName) {
      setNewOutstandingInvoices({
        ...newOutstandingInvoices,
        additionalDetails: latestAdditionalDetails,
      });
    }
  }, [latestAdditionalDetails]);

  return (
    <Dialog
      header="Adicionar Nova Conta a Pagar"
      visible={visible}
      onHide={onHide}
      className="w-60rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Favorecido"
            htmlFor="vendorName"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              field="shortenedName"
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedSupplier}
              suggestions={allSupplierItems}
              completeMethod={suppliersSearch}
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
              setNewPaymentDeadline(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newPaymentDeadline}
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
            value={formatCurrency(newOutstandingInvoices.totalAmount)}
            onChange={(e) => {
              if (e.value !== null) {
                setNewOutstandingInvoices({
                  ...newOutstandingInvoices,
                  totalAmount: Math.round(e.value * 100),
                });
                setInvalidTotalAmount(false);
              }
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
                  setNewOutstandingInvoices({
                    ...newOutstandingInvoices,
                    paymentStatus: e.value,
                  })
                }
                checked={newOutstandingInvoices.paymentStatus === true}
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
                  setNewOutstandingInvoices({
                    ...newOutstandingInvoices,
                    paymentStatus: e.value,
                  });
                }}
                checked={newOutstandingInvoices.paymentStatus === false}
              />
              <label htmlFor="option2" className="ml-2">
                Não
              </label>
            </div>
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Memo"
            htmlFor="additionalDetails"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewOutstandingInvoices({
                ...newOutstandingInvoices,
                additionalDetails: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newOutstandingInvoices?.additionalDetails}
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

export default OutstadingInvoicesConstructionCreateDialog;
