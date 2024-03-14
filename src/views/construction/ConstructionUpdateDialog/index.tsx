import LabelTitle from "@/components/LabelTitle";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import {
  convertStringToDate,
  formatDateToYYYYMMDD,
  localeBR,
} from "@/util/date";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";

interface ConstructionUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (construction: Construction) => void;
  data: Construction;
}

function ConstructionUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: ConstructionUpdateDialog) {
  const [updatedConstruction, setUpdatedConstruction] = useState<Construction>({
    id: data.id,
    code: data.code,
    bankBranch: data.bankBranch,
    responsible: data.responsible,
    cad: data.cad,
    isCad: data.isCad,
    client: data.client,
    openingDate: data.openingDate,
    closedDate: data.closedDate,
    local: data.local,
    service: data.service,
    userId: data.userId,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [newOpeningDate, setNewOpeningDate] = useState<Date | null>(
    convertStringToDate(data.openingDate)
  );
  const [newClosedDate, setNewClosedDate] = useState<Date | null>(
    convertStringToDate(data.closedDate)
  );
  const [invalidCode, setInvalidCode] = useState<boolean>(false);
  const [invalidClient, setInvalidClient] = useState<boolean>(false);
  const [invalidLocal, setInvalidLocal] = useState<boolean>(false);
  const [invalidResponsible, setInvalidResponsible] = useState<boolean>(false);
  const [invalidBankBranch, setInvalidBankBranch] = useState<boolean>(false);
  const [invalidService, setInvalidService] = useState<boolean>(false);
  const [invalidOpeningDate, setInvalidOpeningDate] = useState<boolean>(false);

  useEffect(() => {
    localeBR;
  }, []);

  useEffect(() => {
    setUpdatedConstruction((prevConstruction) => ({
      ...prevConstruction,
      openingDate:
        formatDateToYYYYMMDD(newOpeningDate) || prevConstruction.openingDate,
      closedDate:
        formatDateToYYYYMMDD(newClosedDate) || prevConstruction.closedDate,
    }));
  }, [newOpeningDate, newClosedDate]);

  function validateFields() {
    setInvalidCode(!updatedConstruction.code || updatedConstruction.code === 0);
    setInvalidBankBranch(
      !updatedConstruction.bankBranch || updatedConstruction.bankBranch === 0
    );
    setInvalidResponsible(
      !updatedConstruction.responsible || updatedConstruction.responsible === ""
    );
    setInvalidService(
      !updatedConstruction.service || updatedConstruction.service === ""
    );
    setInvalidOpeningDate(!updatedConstruction.openingDate);
    if (
      !invalidCode &&
      !invalidClient &&
      !invalidLocal &&
      !invalidResponsible &&
      !invalidBankBranch &&
      !invalidService &&
      !invalidOpeningDate
    ) {
      onUpdate(updatedConstruction);
      onHide();
    }
  }

  return (
    <Dialog
      header="Atualizar Obra"
      visible={visible}
      onHide={onHide}
      className="w-50rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Código"
            htmlFor="code"
            className="font-semibold"
            required={true}
          />
          <InputNumber
            onValueChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                code: typeof e.value === "number" ? e.value : null,
              });
              setInvalidCode(false);
            }}
            value={updatedConstruction.code}
            useGrouping={false}
          />
          {invalidCode && (
            <Message severity="error" text="Código é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Cliente"
            htmlFor="client"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                client: e.target.value,
              });
              setInvalidClient(false);
            }}
            value={updatedConstruction?.client}
          />
          {invalidClient && (
            <Message severity="error" text="Cliente é obrigatório" />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Local"
            htmlFor="local"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                local: e.target.value,
              });
              setInvalidLocal(false);
            }}
            value={updatedConstruction?.local}
          />
          {invalidLocal && (
            <Message severity="error" text="Local é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Responsável"
            htmlFor="responsible"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                responsible: e.target.value,
              });
              setInvalidResponsible(false);
            }}
            value={updatedConstruction?.responsible}
          />
          {invalidResponsible && (
            <Message severity="error" text="Responsável é obrigatório" />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Descrição do Serviço"
            htmlFor="service"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                service: e.target.value,
              });
            }}
            value={updatedConstruction?.service}
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="CAD" htmlFor="cad" className="font-semibold" />
          <div className="flex align-items-center gap-2 w-full a">
            <div className="flex">
              <RadioButton
                value={true}
                name="Sim"
                onChange={(e) =>
                  setUpdatedConstruction({
                    ...updatedConstruction,
                    cad: e.value,
                  })
                }
                checked={updatedConstruction.cad === true}
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
                  setUpdatedConstruction({
                    ...updatedConstruction,
                    cad: e.value,
                  });
                }}
                checked={updatedConstruction.cad === false}
              />
              <label htmlFor="option2" className="ml-2">
                Não
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Aberta em (1º acesso)"
            htmlFor="openingDate"
            className="font-semibold"
          />
          <Calendar
            value={newOpeningDate}
            locale="pt"
            onChange={(e) => {
              setNewOpeningDate(e.value || null);
            }}
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Encerrada em"
            htmlFor="closedDate"
            className="font-semibold"
          />
          <Calendar
            value={newClosedDate}
            locale="pt"
            onChange={(e) => {
              setNewClosedDate(e.value || null);
            }}
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Agência"
            htmlFor="branchBank"
            className="font-semibold"
            required={true}
          />
          <InputNumber
            onValueChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                bankBranch: typeof e.value === "number" ? e.value : null,
              });
              setInvalidBankBranch(false);
            }}
            value={updatedConstruction?.bankBranch}
            useGrouping={false}
          />
          {invalidBankBranch && (
            <Message severity="error" text="Agência é obrigatória" />
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

export default ConstructionUpdateDialog;
