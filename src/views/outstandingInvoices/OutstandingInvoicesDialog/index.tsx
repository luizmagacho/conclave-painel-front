import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { Cost } from "@/services/costs/type";
import { OutstandingInvoices } from "@/services/outstanding-invoices/type";
import { Supplier, SupplierName } from "@/services/supplier/type";
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

function OutstandingInvoicesDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: OutstandingInvoicesDialog) {
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
  const { constructions, handleGetConstructionById, selectedConstruction } =
    useContext(ConstructionContext);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierName>({
    shortenedName: data.vendorName,
  });

  const { suppliers } = useContext(SupplierContext);

  const [checkedConstruction, setCheckedConstruction] =
    useState<Construction | null>(selectedConstruction);
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

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setUpdatedOutstandingInvoices({
      ...updatedOutstandingInvoices,
      userId: userId || "",
    });
    setInvalidVendorName(
      !updatedOutstandingInvoices.vendorName ||
        updatedOutstandingInvoices.vendorName === ""
    );
    setInvalidTotalAmount(
      !updatedOutstandingInvoices.totalAmount ||
        updatedOutstandingInvoices.totalAmount >= 0
    );

    setInvalidCenterCost(
      !updatedOutstandingInvoices.centerCost ||
        updatedOutstandingInvoices.centerCost === ""
    );

    if (!invalidTotalAmount && !invalidVendorName && !invalidCenterCost) {
      onUpdate(updatedOutstandingInvoices);
      onHide();
    }
  }

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(constructions);

  const [suppliersItems, setSuppliersItems] = useState<Supplier[]>(suppliers);

  const constructionSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredConstructions;
      if (!event.query.trim().length) {
        _filteredConstructions = [...constructions];
      } else {
        _filteredConstructions = constructionsItems.filter((construction) => {
          return construction.code.startsWith(event.query);
        });
      }
      setConstructionsItems(_filteredConstructions);
    }, 150);
  };

  const supplierSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...suppliers];
      } else {
        _filteredSuppliers = suppliersItems.filter((supplier) => {
          return supplier.shortenedName.startsWith(event.query);
        });
        setSuppliersItems(_filteredSuppliers);
      }
    }, 150);
  };

  useEffect(() => {
    setUpdatedOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      centerCostId:
        checkedConstruction?.id || prevOutstandingInvoices.centerCostId,
      centerCost:
        checkedConstruction?.code || prevOutstandingInvoices.centerCost,
      bankBranch:
        checkedConstruction?.bankBranch || prevOutstandingInvoices.bankBranch,
      localBank:
        checkedConstruction?.local || prevOutstandingInvoices.localBank,
    }));
  }, [checkedConstruction]);

  useEffect(() => {
    setCheckedConstruction(selectedConstruction);
  }, [selectedConstruction]);

  useEffect(() => {
    setUpdatedOutstandingInvoices((prevOutstandingInvoices) => ({
      ...prevOutstandingInvoices,
      vendorName: selectedSupplier.shortenedName,
    }));
  }, [selectedSupplier]);

  useEffect(() => {
    handleGetConstructionById(data.centerCostId);
  }, []);

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
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
            text="Centro de Custo"
            htmlFor="centerCost"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="code"
              dropdown
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={checkedConstruction}
              suggestions={constructionsItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setCheckedConstruction(e.value)
              }
            />
            {invalidCenterCost && (
              <Message
                severity="error"
                text="Centro de Custo é obrigatório"
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
            value={updatedOutstandingInvoices?.localBank}
            disabled
          />
        </div>
      </div>

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
              suggestions={suppliersItems}
              completeMethod={supplierSearch}
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
            value={formatCurrency(updatedOutstandingInvoices?.totalAmount)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedOutstandingInvoices({
                  ...updatedOutstandingInvoices,
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
            text="Tipo Obra"
            htmlFor="costType"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedOutstandingInvoices({
                ...updatedOutstandingInvoices,
                costType: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedOutstandingInvoices?.costType}
          />
          {invalidCostCategory && (
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

export default OutstandingInvoicesDialog;
