import LabelTitle from "@/components/LabelTitle";
import { Tool } from "@/services/tool/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";

interface ToolUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (tool: Tool) => void;
  data: Tool;
}

function ToolUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: ToolUpdateDialog) {
  const router = useRouter();
  const [updatedTool, setUpdatedTool] = useState<Tool>({
    id: data.id,
    name: data.name,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    bankBranch: data.bankBranch,
    localBank: data.localBank,
    dateLoanFrom: data.dateLoanFrom,
    dateLoanFromFormatted: data.dateLoanFromFormatted,
    dateLoanTo: data.dateLoanTo,
    dateLoanToFormatted: data.dateLoanToFormatted,
    responsible: data.responsible,
    userId: data.userId,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [updatedDateLoanFrom, setUpdatedDateLoanFrom] = useState<Date | null>(
    convertStringToDate(data.dateLoanFrom)
  );
  const [invalidDateLoanFrom, setInvalidDateLoanFrom] =
    useState<boolean>(false);
  const [updatedDateLoanTo, setUpdatedDateLoanTo] = useState<Date | null>(
    convertStringToDate(data.dateLoanTo)
  );
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidResponsible, setInvalidResponsible] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedTool((prevTool) => ({
      ...prevTool,
      dateLoanFrom:
        formatDateToYYYYMMDD(updatedDateLoanFrom) || prevTool.dateLoanFrom,
      dateLoanTo:
        formatDateToYYYYMMDD(updatedDateLoanTo) || prevTool.dateLoanTo,
    }));
  }, [updatedDateLoanFrom, updatedDateLoanTo]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setUpdatedTool({ ...updatedTool, userId: userId || "" });
    setInvalidName(!updatedTool.name || updatedTool.name === "");
    setInvalidResponsible(
      !updatedTool.responsible && updatedTool.responsible === ""
    );
    setInvalidDateLoanFrom(!updatedDateLoanFrom);

    if (!invalidName && !invalidResponsible && !invalidDateLoanFrom) {
      onUpdate(updatedTool);
      onHide();
    }
  }

  return (
    <Dialog
      header="Editar Ferramenta"
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
            value={updatedTool?.centerCost}
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
            value={updatedTool?.bankBranch}
            disabled={true}
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
              setUpdatedTool({ ...updatedTool, name: e.target.value });
            }}
            value={updatedTool?.name}
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
              setUpdatedTool({ ...updatedTool, responsible: e.target.value });
            }}
            value={updatedTool?.responsible}
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
              setUpdatedDateLoanFrom(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedDateLoanFrom}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidDateLoanFrom && (
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
              setUpdatedDateLoanTo(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedDateLoanTo}
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

export default ToolUpdateDialog;
