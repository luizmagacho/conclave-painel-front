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
    payer: "",
    centerCost: "",
    centerCostId: "",
    bankBranchLocalBank: "",
    typeCenterCost: "",
    issueDate: "",
    receiptDate: "",
    workerValue: null,
    materialValue: null,
    inssValue: null,
    totalAmount: null,
    valueRemas: null,
    userId: localStorage.getItem("portal.id") as string,
    enabled: true,
    invoice: "",
    numContract: "",
  });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [newIssueDate, setNewIssueDate] = useState<Date | null>(null);
  const [invalidIssueDate, setInvalidIssueDate] = useState<boolean>(false);
  const [newReceiptDate, setNewReceiptDate] = useState<Date | null>(null);
  const [invalidReceiptDate, setInvalidReceiptDate] = useState<boolean>(false);
  const [invalidPayer, setInvalidPayer] = useState<boolean>(false);
  const [invalidCostCategory, setInvalidCostCategory] =
    useState<boolean>(false);
  const [invalidWorkerValue, setInvalidWorkerValue] = useState<boolean>(false);
  const [invalidMaterialValue, setInvalidMaterialValue] =
    useState<boolean>(false);
  useEffect(() => {
    setNewCost((prevCost) => ({
      ...prevCost,
      issueDate: formatDateToYYYYMMDD(newIssueDate) || prevCost.issueDate,
      receiptDate: formatDateToYYYYMMDD(newReceiptDate) || prevCost.receiptDate,
    }));
  }, [newIssueDate, newReceiptDate]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setNewCost({ ...newCost, userId: userId || "" });
    setInvalidPayer(!newCost.payer || newCost.payer === "");
    setInvalidWorkerValue(!newCost.workerValue || newCost.workerValue === null);
    setInvalidMaterialValue(
      !newCost.materialValue || newCost.materialValue === null
    );
    setInvalidIssueDate(!newIssueDate);

    if (
      !invalidIssueDate &&
      !invalidPayer &&
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

  // useEffect(() => {
  //   if (newCost.workerValue !== null && newCost.materialValue) {
  //     const totalValue = newCost.workerValue + newCost.materialValue;
  //     setNewCost((prevCost) => ({
  //       ...prevCost,
  //       totalAmount: totalValue || prevCost.totalAmount,
  //     }));
  //   }
  // }, [newCost.workerValue, newCost.materialValue]);

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

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
    setNewCost((prevCost) => ({
      ...prevCost,
      centerCostId: selectedConstruction?.id || "",
      centerCost: selectedConstruction?.code || "",
      bankBranchLocalBank: selectedConstruction?.bankBranch
        ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
        : "" || "",
      typeCenterCost: selectedConstruction?.service || "",
      payer: selectedConstruction?.client || "",
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
              dropdown
              value={selectedConstruction}
              suggestions={constructionsItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedConstruction(e.value)
              }
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidIssueDate && (
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
            text="Agência"
            htmlFor="bankBranchLocalBank"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.bankBranchLocalBank}
            disabled
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Tomador"
            htmlFor="payer"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                payer: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.payer}
            disabled
          />
          {invalidPayer && (
            <Message
              severity="error"
              text="Tomador é obrigatório"
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
                typeCenterCost: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.typeCenterCost}
            disabled
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
            text="Data da Emissão"
            htmlFor="issueDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewIssueDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newIssueDate}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidIssueDate && (
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
            htmlFor="ReceiptDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewReceiptDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newReceiptDate}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidReceiptDate && (
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
            text="Valor Total"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(newCost?.totalAmount)}
            onChange={(e) => {
              if (e.value) {
                setNewCost({
                  ...newCost,
                  totalAmount: e.value * 100,
                  workerValue: (e.value / 2) * 100,
                  materialValue: (e.value / 2) * 100,
                  inssValue: (e.value / 2) * 100 * 0.11,
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
            disabled
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
