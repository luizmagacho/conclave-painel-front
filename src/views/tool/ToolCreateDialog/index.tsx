import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { ToolDTO } from "@/services/tool/type";
import { formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface ToolCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (tool: ToolDTO) => void;
}

function ToolCreateDialog({ visible, onCreate, onHide }: ToolCreateDialog) {
  const router = useRouter();
  const { selectedConstruction } = useContext(ConstructionContext);
  const [newTool, setNewTool] = useState<ToolDTO>({
    name: "",
    centerCost: selectedConstruction?.code || "",
    centerCostId: selectedConstruction?.id || "",
    bankBranchLocalBank: selectedConstruction?.bankBranch
      ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
      : "" || "",
    payer: selectedConstruction?.client || "",
    typeCenterCost: selectedConstruction?.service || "",
    dateLoanFrom: "",
    dateLoanTo: "",
    responsible: "",
    userId: localStorage.getItem("portal.id") as string,
    enabled: true,
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidResponsible, setInvalidResponsible] = useState<boolean>(false);
  const [newDateLoanFrom, setNewDateLoanFrom] = useState<Date | null>(null);
  const [invalidNewDateLoanFrom, setInvalidNewDateLoanFrom] =
    useState<boolean>(false);
  const [newDateLoanTo, setNewDateLoanTo] = useState<Date | null>(null);

  useEffect(() => {
    setNewTool((prevTool) => ({
      ...prevTool,
      dateLoanFrom:
        formatDateToYYYYMMDD(newDateLoanFrom) || prevTool.dateLoanFrom,
      dateLoanTo: formatDateToYYYYMMDD(newDateLoanTo) || prevTool.dateLoanTo,
    }));
  }, [newDateLoanFrom, newDateLoanTo]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setNewTool({ ...newTool, userId: userId || "" });
    setInvalidName(!newTool.name || newTool.name === "");
    setInvalidNewDateLoanFrom(!newDateLoanFrom);
    setInvalidResponsible(!newTool.responsible || newTool.responsible === "");

    if (!invalidNewDateLoanFrom && !invalidName && !invalidResponsible) {
      onCreate(newTool);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Nova Ferramenta"
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
            value={newTool?.centerCost}
            onChange={(e) => {
              setNewTool({ ...newTool, centerCost: e.target.value });
            }}
            disabled={selectedConstruction?.code !== null}
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
            value={newTool?.bankBranchLocalBank}
            onChange={(e) => {
              setNewTool({
                ...newTool,
                bankBranchLocalBank: e.target.value.toUpperCase(),
              });
            }}
            disabled={selectedConstruction?.bankBranch !== null}
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="Nome" htmlFor="name" className="font-semibold" />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            onChange={(e) => {
              setNewTool({ ...newTool, name: e.target.value.toUpperCase() });
            }}
            value={newTool?.name}
          />
          {invalidName && (
            <Message
              severity="error"
              text="Nome é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Responsável"
            htmlFor="responsible"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            onChange={(e) => {
              setNewTool({
                ...newTool,
                responsible: e.target.value.toUpperCase(),
              });
            }}
            value={newTool?.responsible}
          />
          {invalidResponsible && (
            <Message
              severity="error"
              text="Responsável é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Empréstimo"
            htmlFor="dateLoanFrom"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewDateLoanFrom(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newDateLoanFrom}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidNewDateLoanFrom && (
            <Message
              severity="error"
              text="Data de Custo é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data de Devolução"
            htmlFor="dateLoanTo"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewDateLoanTo(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newDateLoanTo}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
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

export default ToolCreateDialog;
