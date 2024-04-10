import LabelTitle from "@/components/LabelTitle";
import { ConstructionDTO } from "@/services/construction/type";
import { formatDateToYYYYMMDD, localeBR } from "@/util/date";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";

interface ConstructionCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (construction: ConstructionDTO) => void;
}

function ConstructionCreateDialog({
  visible,
  onHide,
  onCreate,
}: ConstructionCreateDialog) {
  const [newConstruction, setNewConstruction] = useState<ConstructionDTO>({
    code: "",
    bankBranch: "",
    responsible: "",
    cad: false,
    client: "",
    openingDate: new Date(),
    local: "",
    service: "",
    userId: "",
  });
  const [newOpeningDate, setNewOpeningDate] = useState<Date | null>();
  const [newClosedDate, setNewClosedDate] = useState<Date | null>();
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
    setNewConstruction((prevConstruction) => ({
      ...prevConstruction,
      openingDate: newOpeningDate || prevConstruction.openingDate,
      closedDate: newClosedDate || prevConstruction.closedDate,
    }));
  }, [newOpeningDate, newClosedDate]);

  async function validateFields() {
    const userId = await Cookies.get("portal.id");
    setNewConstruction({ ...newConstruction, userId: userId || "" });
    setInvalidCode(!newConstruction.code || newConstruction.code === "");
    setInvalidBankBranch(
      !newConstruction.bankBranch || newConstruction.bankBranch === ""
    );
    setInvalidResponsible(
      !newConstruction.responsible || newConstruction.responsible === ""
    );
    setInvalidService(
      !newConstruction.service || newConstruction.service === ""
    );
    setInvalidOpeningDate(!newConstruction.openingDate);

    if (
      !invalidCode &&
      !invalidClient &&
      !invalidLocal &&
      !invalidResponsible &&
      !invalidBankBranch &&
      !invalidService &&
      !invalidOpeningDate
    ) {
      onCreate(newConstruction);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Novo Centro de Custo"
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
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewConstruction({
                ...newConstruction,
                code: e.target.value,
              });
              setInvalidCode(false);
            }}
            value={newConstruction?.code}
          />
          {invalidCode && (
            <Message severity="error" text="Nome é obrigatório" />
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
              setNewConstruction({
                ...newConstruction,
                client: e.target.value.toUpperCase(),
              });
              setInvalidClient(false);
            }}
            value={newConstruction?.client}
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
              setNewConstruction({
                ...newConstruction,
                local: e.target.value.toUpperCase(),
              });
              setInvalidLocal(false);
            }}
            value={newConstruction?.local}
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
              setNewConstruction({
                ...newConstruction,
                responsible: e.target.value.toUpperCase(),
              });
              setInvalidResponsible(false);
            }}
            value={newConstruction?.responsible}
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
              setNewConstruction({
                ...newConstruction,
                service: e.target.value.toUpperCase(),
              });
            }}
            value={newConstruction?.service}
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
                  setNewConstruction({ ...newConstruction, cad: e.value })
                }
                checked={newConstruction.cad === true}
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
                  setNewConstruction({ ...newConstruction, cad: e.value });
                }}
                checked={newConstruction.cad === false}
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
            id="buttondisplay"
            value={newOpeningDate}
            onChange={(e) => {
              setNewOpeningDate(e.value || null);
            }}
            locale="pt"
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
            id="buttondisplay"
            value={newClosedDate}
            onChange={(e) => {
              setNewClosedDate(e.value || null);
            }}
            locale="pt"
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
          <InputText
            type="text"
            onChange={(e) => {
              setNewConstruction({
                ...newConstruction,
                bankBranch: e.target.value,
              });
              setInvalidBankBranch(false);
            }}
            value={newConstruction?.bankBranch}
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

export default ConstructionCreateDialog;
