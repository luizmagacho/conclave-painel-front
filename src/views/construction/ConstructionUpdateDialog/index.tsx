import LabelTitle from "@/components/LabelTitle";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import {
  convertStringToDate,
  formatDateToYYYYMMDD,
  localeBR,
} from "@/util/date";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
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
  const role = Cookies.get("portal.role");
  const [updatedConstruction, setUpdatedConstruction] = useState<Construction>({
    id: data.id,
    code: data.code,
    bankBranch: data.bankBranch,
    responsible: data.responsible,
    cad: data.cad,
    isCad: data.isCad,
    upe: data.upe,
    sap: data.sap,
    client: data.client,
    openingDate: data.openingDate,
    closedDate: data.closedDate,
    local: data.local,
    service: data.service,
    totalBilled: data.totalBilled,
    totalRemas: data.totalRemas,
    userId: data.userId,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [newOpeningDate, setNewOpeningDate] = useState<Date | null>(
    convertStringToDate(data.openingDate)
  );
  const [newClosedDate, setNewClosedDate] = useState<Date | null>(
    convertStringToDate(data.closedDate || "")
  );
  const [invalidCode, setInvalidCode] = useState<boolean>(false);
  const [invalidClient, setInvalidClient] = useState<boolean>(false);
  const [invalidLocal, setInvalidLocal] = useState<boolean>(false);
  const [invalidResponsible, setInvalidResponsible] = useState<boolean>(false);
  const [invalidBankBranch, setInvalidBankBranch] = useState<boolean>(false);
  const [invalidService, setInvalidService] = useState<boolean>(false);
  const [invalidOpeningDate, setInvalidOpeningDate] = useState<boolean>(false);
  const [invalidClosedDate, setInvalidClosedDate] = useState<boolean>(false);

  useEffect(() => {
    localeBR;
  }, []);

  useEffect(() => {
    setUpdatedConstruction((prevConstruction) => ({
      ...prevConstruction,
      openingDate:
        formatDateToYYYYMMDD(newOpeningDate) || prevConstruction.openingDate,
      closedDate: formatDateToYYYYMMDD(newClosedDate),
    }));
  }, [newOpeningDate, newClosedDate]);

  function validateFields() {
    setInvalidCode(updatedConstruction.code === "");
    setInvalidBankBranch(updatedConstruction.bankBranch === "");
    setInvalidLocal(updatedConstruction.local === "");
    setInvalidResponsible(updatedConstruction.responsible === "");
    setInvalidService(updatedConstruction.service === "");
    setInvalidClient(updatedConstruction.client === "");

    setInvalidOpeningDate(!newOpeningDate);

    if (newOpeningDate && newClosedDate)
      setInvalidClosedDate(newClosedDate < newOpeningDate);

    if (
      updatedConstruction.code !== "" &&
      updatedConstruction.client !== "" &&
      updatedConstruction.local !== "" &&
      updatedConstruction.responsible !== "" &&
      updatedConstruction.bankBranch !== "" &&
      newOpeningDate
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
          <InputText
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                code: e.target.value,
              });
              setInvalidCode(false);
            }}
            value={updatedConstruction.code}
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
          {invalidOpeningDate && (
            <Message severity="error" text="Data de Abertura é obrigatório" />
          )}
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
              setInvalidClosedDate(false);
            }}
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidClosedDate && (
            <Message
              severity="error"
              text="Data de Encerrada não pode ser menor que a Data de Abertura"
            />
          )}
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
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                bankBranch: e.target.value,
              });
              setInvalidBankBranch(false);
            }}
            value={updatedConstruction?.bankBranch}
          />
          {invalidBankBranch && (
            <Message severity="error" text="Agência é obrigatória" />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="UPE" htmlFor="upe" className="font-semibold" />
          <InputMask
            mask="999999"
            placeholder="999999"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                upe: e.target.value || "",
              });
            }}
            value={updatedConstruction?.upe}
          />
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="SAP" htmlFor="sap" className="font-semibold" />
          <InputMask
            mask="999999/9999"
            placeholder="999999/9999"
            onChange={(e) => {
              setUpdatedConstruction({
                ...updatedConstruction,
                sap: e.target.value || "",
              });
            }}
            value={updatedConstruction?.sap}
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

export default ConstructionUpdateDialog;
