import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { CostDTO } from "@/services/costs/type";
import { formatDateToYYYYMMDD } from "@/util/date";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface CostCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (cost: CostDTO) => void;
}

function CostCreateDialog({ visible, onCreate, onHide }: CostCreateDialog) {
  const router = useRouter();
  const { id } = router.query;
  const { selectedConstruction } = useContext(ConstructionContext);
  const [newCost, setNewCost] = useState<CostDTO>({
    name: "",
    costCenter: selectedConstruction?.code || "",
    bankBranch: selectedConstruction?.bankBranch || "",
    costType: "",
    localBank: selectedConstruction?.local || "",
    purchaseDate: "",
    value: null,
    valueRemas: null,
    userId: "",
    enabled: true,
  });
  const [newPurchaseDate, setNewPurchaseDate] = useState<Date | null>(null);
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidValue, setInvalidValue] = useState<boolean>(false);
  const [invalidValueRemas, setInvalidValueRemas] = useState<boolean>(false);
  useEffect(() => {
    setNewCost((prevCost) => ({
      ...prevCost,
      purchaseDate:
        formatDateToYYYYMMDD(newPurchaseDate) || prevCost.purchaseDate,
    }));
  }, [newPurchaseDate]);

  async function validateFields() {
    const userId = await Cookies.get("portal.id");
    setNewCost({ ...newCost, userId: userId || "" });
    setInvalidName(!newCost.name || newCost.name === "");
    setInvalidValue(!newCost.value || newCost.value === null);
    setInvalidValueRemas(!newCost.valueRemas || newCost.value === null);
    setInvalidPurchaseDate(!newPurchaseDate);

    if (!invalidPurchaseDate && !invalidName && !invalidValue) {
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

  return (
    <Dialog
      header="Adicionar Novo Custo"
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
            onChange={(e) => {
              setNewCost({
                ...newCost,
                costCenter: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.costCenter}
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
            onChange={(e) => {
              setNewCost({
                ...newCost,
                bankBranch: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.bankBranch}
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
          <LabelTitle text="Nome" htmlFor="name" className="font-semibold" />
          <InputText
            type="text"
            onChange={(e) => {
              setNewCost({
                ...newCost,
                name: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newCost?.name}
            disabled={true}
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
            value={formatCurrency(newCost?.value)}
            onChange={(e) => {
              if (e.value) {
                setNewCost({ ...newCost, value: e.value * 100 });
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

export default CostCreateDialog;
