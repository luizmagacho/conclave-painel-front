import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { OutstandingInvoicesDTO } from "@/services/outstanding-invoices/type";
import { Supplier, SupplierName } from "@/services/supplier/type";
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

interface OutstandingInvoicesCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (OutstandingInvoices: OutstandingInvoicesDTO) => void;
}

function OutstandingInvoicesCreateDialog({
  visible,
  onCreate,
  onHide,
}: OutstandingInvoicesCreateDialog) {
  const router = useRouter();
  const [newOutstandingInvoices, setNewOutstandingInvoices] =
    useState<OutstandingInvoicesDTO>({
      name: "",
      vendorName: "",
      centerCost: "",
      centerCostId: "",
      bankBranch: "",
      costType: "",
      costCategory: "",
      localBank: "",
      purchaseDate: "",
      paymentDeadline: "",
      totalAmount: null,
      userId: localStorage.getItem("portal.id") as string,
      enabled: true,
      additionalDetails: "",
      paymentStatus: false,
    });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [selectedSupplier, setSelectedSupplier] = useState<string>();
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

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setNewOutstandingInvoices({
      ...newOutstandingInvoices,
      userId: userId || "",
    });
    setInvalidVendorName(
      !newOutstandingInvoices.vendorName ||
        newOutstandingInvoices.vendorName === ""
    );
    setInvalidTotalAmount(!newOutstandingInvoices.totalAmount);

    setInvalidCenterCost(
      !newOutstandingInvoices.centerCost ||
        newOutstandingInvoices.centerCost === ""
    );

    if (!invalidTotalAmount && !invalidVendorName && !invalidCenterCost) {
      onCreate(newOutstandingInvoices);
      onHide();
    }
  }

  const { allConstructions } = useContext(ConstructionContext);

  const { allSuppliersShortenedName, handleGetAllShortenedName } =
    useContext(SupplierContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

  const [allSupplierItems, setAllSupplierItems] = useState<string[]>(
    allSuppliersShortenedName
  );

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

  const suppliersSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliersShortenedName];
      } else {
        _filteredSuppliers = allSuppliersShortenedName.filter((supplier) => {
          return supplier
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllSupplierItems(_filteredSuppliers);
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
    }));
  }, [selectedConstruction]);

  useEffect(() => {
    setNewOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      vendorName: selectedSupplier || prevOutstandingInvoices.vendorName,
    }));
  }, [selectedSupplier]);

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

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
            text="Obra"
            htmlFor="centerOutstandingInvoices"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="code"
              dropdown
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedConstruction}
              suggestions={constructionsItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedConstruction(e.value)
              }
            />
            {invalidCenterCost && (
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
            text="Local da Agência"
            htmlFor="localBank"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newOutstandingInvoices?.localBank}
            disabled
          />
        </div>
      </div>
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
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedSupplier}
              suggestions={allSupplierItems}
              completeMethod={suppliersSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedSupplier(e.value)
              }
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
            value={formatCurrency(newOutstandingInvoices?.totalAmount)}
            onChange={(e) => {
              if (e.value) {
                setNewOutstandingInvoices({
                  ...newOutstandingInvoices,
                  totalAmount: e.value * 100,
                });
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
          <InputText
            type="text"
            onChange={(e) => {
              setNewOutstandingInvoices({
                ...newOutstandingInvoices,
                costCategory: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newOutstandingInvoices?.costCategory}
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

export default OutstandingInvoicesCreateDialog;
