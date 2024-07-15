import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { CostDTO } from "@/services/costs/type";
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

interface CostCreateGenericDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (cost: CostDTO) => void;
}

function CostCreateGenericDialog({
  visible,
  onCreate,
  onHide,
}: CostCreateGenericDialog) {
  const router = useRouter();
  const { id } = router.query;
  const [newCost, setNewCost] = useState<CostDTO>({
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
    workerValue: null,
    materialValue: null,
    inssValue: null,
    totalAmount: null,
    valueRemas: null,
    userId: localStorage.getItem("portal.id") as string,
    enabled: true,
    additionalDetails: "",
    paymentStatus: false,
    invoice: "",
    numContract: "",
  });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [newPurchaseDate, setNewPurchaseDate] = useState<Date | null>(null);
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [newPaymentDeadline, setNewPaymentDeadline] = useState<Date | null>(
    null
  );
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidCostCategory, setInvalidCostCategory] =
    useState<boolean>(false);
  const [invalidWorkerValue, setInvalidWorkerValue] = useState<boolean>(false);
  const [invalidMaterialValue, setInvalidMaterialValue] =
    useState<boolean>(false);
  useEffect(() => {
    setNewCost((prevCost) => ({
      ...prevCost,
      purchaseDate:
        formatDateToYYYYMMDD(newPurchaseDate) || prevCost.purchaseDate,
    }));
  }, [newPurchaseDate]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setNewCost({ ...newCost, userId: userId || "" });
    setInvalidVendorName(!newCost.vendorName || newCost.vendorName === "");
    setInvalidWorkerValue(!newCost.workerValue || newCost.workerValue === null);
    setInvalidMaterialValue(
      !newCost.materialValue || newCost.materialValue === null
    );
    setInvalidPurchaseDate(!newPurchaseDate);

    if (
      !invalidPurchaseDate &&
      !invalidVendorName &&
      !invalidWorkerValue &&
      !invalidMaterialValue
    ) {
      onCreate(newCost);
      onHide();
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  useEffect(() => {
    if (newCost.workerValue !== null && newCost.materialValue) {
      const totalValue = newCost.workerValue + newCost.materialValue;
      setNewCost((prevCost) => ({
        ...prevCost,
        totalAmount: totalValue || prevCost.totalAmount,
      }));
    }
  }, [newCost.workerValue, newCost.materialValue]);

  const { constructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(constructions);

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

  useEffect(() => {
    setNewCost((prevCost) => ({
      ...prevCost,
      centerCostId: selectedConstruction?.id || prevCost.centerCostId,
      centerCost: selectedConstruction?.code || prevCost.centerCost,
      bankBranch: selectedConstruction?.bankBranch || prevCost.bankBranch,
      localBank: selectedConstruction?.local || prevCost.localBank,
    }));
  }, [selectedConstruction]);

  return (
    <Dialog
      header="Adicionar Novo Custo"
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
              value={selectedConstruction}
              suggestions={constructionsItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedConstruction(e.value)
              }
              className="flex-grow" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidPurchaseDate && (
              <Message
                severity="error"
                text="Data de Custo é obrigatório"
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
            value={newCost?.localBank}
            disabled
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data da Emissão"
            htmlFor="purchaseDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewPurchaseDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newPurchaseDate}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidPurchaseDate && (
            <Message
              severity="error"
              text="Data de Custo é obrigatório"
              className="smaller-text"
            />
          )}
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
            text="Favorecido"
            htmlFor="vendorName"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                vendorName: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.vendorName}
          />
          {invalidVendorName && (
            <Message
              severity="error"
              text="Favorecido é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Tipo de Obra"
            htmlFor="type"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                costType: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.costType}
          />
          {invalidCostCategory && (
            <Message
              severity="error"
              text="Tipo de Obra é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Mão de Obra"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(newCost?.workerValue)}
            onChange={(e) => {
              if (e.value) {
                setNewCost({
                  ...newCost,
                  workerValue: e.value * 100,
                  materialValue: e.value * 100,
                  inssValue: e.value * 100 * 0.11,
                });
              }
            }}
          />
          {invalidWorkerValue && (
            <Message
              severity="error"
              text="Valor Mão de Obra é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Material"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(newCost?.materialValue)}
            onChange={(e) => {
              if (e.value) {
                setNewCost({ ...newCost, materialValue: e.value * 100 });
              }
            }}
            disabled
          />
          {invalidWorkerValue && (
            <Message
              severity="error"
              text="Valor Material é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        {/* <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Remas"
            htmlFor="remasValue"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(newCost?.valueRemas)}
            onChange={(e) => {
              if (e.value) {
                setNewCost({ ...newCost, valueRemas: e.value * 100 });
              }
            }}
          />
          {invalidValueRemas && (
            <Message
              severity="error"
              text="Valor Remas é obrigatório"
              className="smaller-text"
            />
          )}
        </div> */}
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Nota Fiscal"
            htmlFor="nf"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                invoice: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.invoice}
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Contrato"
            htmlFor="contreact"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                numContract: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.numContract}
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

export default CostCreateGenericDialog;
