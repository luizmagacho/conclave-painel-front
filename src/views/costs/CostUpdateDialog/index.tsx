import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Cost } from "@/services/costs/type";
import { convertStringToDate } from "@/util/date";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useState } from "react";

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
  const { selectedConstruction } = useContext(ConstructionContext);
  const [updatedCost, setUpdatedCost] = useState<Cost>({
    id: data.id,
    name: data.name,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    purchaseDate: data.purchaseDate,
    purchaseDateFormatted: data.purchaseDateFormatted,
    bankBranch: data.bankBranch,
    localBank: data.localBank,
    costType: data.costType,
    value: data.value,
    valueRemas: data.valueRemas,
    userId: data.userId,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [updatedPurchaseDate, setUpdatedPurchaseDate] = useState<Date | null>(
    convertStringToDate(data.purchaseDate)
  );
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidValue, setInvalidValue] = useState<boolean>(false);
  const [invalidValueRemas, setInvalidValueRemas] = useState<boolean>(false);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setUpdatedCost({ ...updatedCost, userId: userId || "" });
    setInvalidName(!updatedCost.name || updatedCost.name === "");
    setInvalidValue(!updatedCost.value || updatedCost.value === null);
    setInvalidValueRemas(!updatedCost.valueRemas || updatedCost.value === null);
    setInvalidPurchaseDate(!updatedPurchaseDate);

    if (!invalidPurchaseDate && !invalidName && !invalidValue) {
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

  return (
    <Dialog
      header="Editar Custo"
      visible={visible}
      onHide={onHide}
      className="w-50rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Código do Centro de Custo"
            htmlFor="code"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.centerCost}
            disabled={true}
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Agência"
            htmlFor="branchBank"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.bankBranch}
            disabled={true}
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Custo"
            htmlFor="purchaseDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setUpdatedPurchaseDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPurchaseDate}
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
          <LabelTitle text="Nome" htmlFor="name" className="font-semibold" />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                name: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.name}
          />
          {invalidName && (
            <Message
              severity="error"
              text="Nome é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Serviço"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedCost?.value)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedCost({ ...updatedCost, value: e.value * 100 });
              }
            }}
          />
          {invalidValue && (
            <Message
              severity="error"
              text="Valor Serviço é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
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
            value={formatCurrency(updatedCost?.valueRemas)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedCost({ ...updatedCost, valueRemas: e.value * 100 });
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
