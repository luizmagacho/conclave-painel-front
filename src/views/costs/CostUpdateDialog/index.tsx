import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { Cost } from "@/services/costs/type";
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

interface CostUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (cost: Cost) => void;
  data: Cost;
}

function CostUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: CostUpdateDialog) {
  const router = useRouter();
  const { id } = router.query;
  const [updatedCost, setUpdatedCost] = useState<Cost>({
    id: data.id,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    bankBranchLocalBank: data.bankBranchLocalBank,
    typeCenterCost: data.typeCenterCost,
    issueDate: data.issueDate,
    issueDateFormatted: data.issueDateFormatted,
    receiptDate: data.receiptDate,
    receiptDateFormatted: data.receiptDateFormatted,
    workerValue: data.workerValue,
    materialValue: data.materialValue,
    inssValue: data.inssValue,
    valueRemas: data.valueRemas,
    totalAmount: data.totalAmount,
    payer: data.payer,
    userId: data.userId,
    enabled: data.enabled,
    invoice: data.invoice,
    numContract: data.numContract,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [updatedIssueDate, setUpdatedIssueDate] = useState<Date | null>(
    convertStringToDate(data.issueDate)
  );
  const [invalidIssueDate, setInvalidIssueDate] = useState<boolean>(false);
  const [updatedReceiptDate, setUpdatedReceiptDate] = useState<Date | null>(
    convertStringToDate(data.receiptDate)
  );
  const [invalidReceiptDate, setInvalidReceiptDate] = useState<boolean>(false);
  const [invalidPayer, setInvalidPayer] = useState<boolean>(false);
  const [invalidWorkerValue, setInvalidWorkerValue] = useState<boolean>(false);
  const [invalidMaterialValue, setInvalidMaterialValue] =
    useState<boolean>(false);
  const [invalidValueRemas, setInvalidValueRemas] = useState<boolean>(false);
  const [invalidTypeCenterCost, setInvalidTypeCenterCost] =
    useState<boolean>(false);

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
    console.log(updatedReceiptDate);
    setUpdatedCost((prevCost) => ({
      ...prevCost,
      issueDate: formatDateToYYYYMMDD(updatedIssueDate) || prevCost.issueDate,
      receiptDate:
        formatDateToYYYYMMDD(updatedReceiptDate) || prevCost.receiptDate,
    }));
  }, [updatedIssueDate, updatedReceiptDate]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setUpdatedCost({ ...updatedCost, userId: userId || "" });
    setInvalidPayer(!updatedCost.payer || updatedCost.payer === "");
    setInvalidWorkerValue(
      !updatedCost.workerValue || updatedCost.workerValue === null
    );
    setInvalidMaterialValue(
      !updatedCost.materialValue || updatedCost.materialValue === null
    );
    setInvalidValueRemas(
      !updatedCost.valueRemas || updatedCost.valueRemas === null
    );
    setInvalidIssueDate(!updatedIssueDate);

    if (
      !invalidIssueDate &&
      !invalidPayer &&
      !invalidWorkerValue &&
      !invalidMaterialValue
    ) {
      onUpdate(updatedCost);
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
    if (updatedCost.workerValue !== null && updatedCost.materialValue) {
      const totalValue = updatedCost.workerValue + updatedCost.materialValue;
      setUpdatedCost((prevCost) => ({
        ...prevCost,
        totalAmount: totalValue || prevCost.totalAmount,
      }));
    }
  }, [updatedCost.workerValue, updatedCost.materialValue]);

  useEffect(() => {
    const fetchConstruction = async () => {
      const relatedConstruction = allConstructions.find(
        (construction) => construction.id === data.centerCostId // Substitua por ID relacionado
      );
      setSelectedConstruction(relatedConstruction);
    };
    fetchConstruction();
  }, []);

  useEffect(() => {
    setUpdatedCost((prevCost) => ({
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
      header="Editar Custo"
      visible={visible}
      onHide={onHide}
      className="w-60rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Obra"
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
              dropdown
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
            value={updatedCost?.bankBranchLocalBank}
            disabled
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Tomador"
            htmlFor="Payer"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                payer: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.payer}
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
            htmlFor="typeCenterCost"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                typeCenterCost: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.typeCenterCost}
            disabled
          />
          {invalidTypeCenterCost && (
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
            text="Data do Custo"
            htmlFor="issueDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setUpdatedIssueDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedIssueDate}
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
              setUpdatedReceiptDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedReceiptDate}
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
            value={formatCurrency(updatedCost?.totalAmount)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedCost({
                  ...updatedCost,
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
            value={formatCurrency(updatedCost?.workerValue)}
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
            value={formatCurrency(updatedCost?.materialValue)}
            disabled
          />
          {invalidMaterialValue && (
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
              setUpdatedCost({
                ...updatedCost,
                invoice: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.invoice}
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
              setUpdatedCost({
                ...updatedCost,
                numContract: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.numContract}
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

export default CostUpdateDialog;
