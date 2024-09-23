import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { ToolDTO } from "@/services/tool/type";
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
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface ToolCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (tool: ToolDTO) => void;
  responsible: string[];
  names: string[];
}

function ToolCreateGenericDialog({
  visible,
  onCreate,
  onHide,
  responsible,
  names,
}: ToolCreateDialog) {
  const router = useRouter();
  const userId = localStorage.getItem("portal.id");
  const [newTool, setNewTool] = useState<ToolDTO>({
    name: "",
    centerCost: "",
    centerCostId: "",
    bankBranchLocalBank: "",
    payer: "",
    typeCenterCost: "",
    dateLoanFrom: "",
    dateLoanTo: "",
    responsible: "",
    userId: localStorage.getItem("portal.id") as string,
    enabled: true,
  });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidPayer, setInvalidPayer] = useState<boolean>(false);
  const [invalidResponsible, setInvalidResponsible] = useState<boolean>(false);
  const [newDateLoanFrom, setNewDateLoanFrom] = useState<Date | null>(null);
  const [invalidNewDateLoanFrom, setInvalidNewDateLoanFrom] =
    useState<boolean>(false);
  const [invalidDates, setInvalidDates] = useState<boolean>(false);
  const [invalidCostCategory, setInvalidCostCategory] =
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

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

  const [namesItems, setNamesItems] = useState<string[]>(names);
  const [responsibleItems, setResponsibleItems] =
    useState<string[]>(responsible);

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

  const namesSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredNames;
      if (!event.query.trim().length) {
        _filteredNames = [...names];
      } else {
        _filteredNames = names.filter((name) => {
          return name.startsWith(event.query);
        });
      }
      setNamesItems(_filteredNames);
    }, 150);
  };

  const responsibleSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredResponsible;
      if (!event.query.trim().length) {
        _filteredResponsible = [...responsible];
      } else {
        _filteredResponsible = responsible.filter((resp) => {
          return resp.startsWith(event.query);
        });
      }
      setResponsibleItems(_filteredResponsible);
    }, 150);
  };

  useEffect(() => {
    setNewTool((prevCost) => ({
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

  function validateFields() {
    setInvalidCenterCost(newTool.centerCost === "");
    setNewTool({ ...newTool, userId: userId || "" });
    setInvalidName(!newTool.name || newTool.name === "");
    setInvalidNewDateLoanFrom(!newDateLoanFrom);
    setInvalidResponsible(!newTool.responsible || newTool.responsible === "");
    if (newDateLoanTo && newDateLoanFrom) {
      setInvalidDates(newDateLoanTo < newDateLoanFrom);
    }

    if (
      !invalidNewDateLoanFrom &&
      !invalidName &&
      !invalidResponsible &&
      !invalidCenterCost &&
      !invalidDates
    ) {
      // onCreate(newTool);
      // onHide();
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
            text="Obra"
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
              onChange={(e: AutoCompleteChangeEvent) => {
                setSelectedConstruction(e.value);
                setInvalidCenterCost(false);
              }}
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidCenterCost && (
              <Message
                severity="error"
                text="Obra é obrigatório"
                style={{ height: "30px", fontSize: "0.4rem" }}
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
            value={newTool?.bankBranchLocalBank}
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
              setNewTool({
                ...newTool,
                payer: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newTool?.payer}
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
              setNewTool({
                ...newTool,
                typeCenterCost: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newTool?.typeCenterCost}
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
          <LabelTitle text="Nome" htmlFor="name" className="font-semibold" />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              value={newTool.name}
              suggestions={namesItems}
              completeMethod={namesSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setNewTool({ ...newTool, name: e.value.toLocaleUpperCase() });
                setInvalidName(false);
              }}
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
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
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Responsável"
            htmlFor="responsible"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              value={newTool.responsible}
              suggestions={responsibleItems}
              completeMethod={responsibleSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setNewTool({
                  ...newTool,
                  responsible: e.value.toLocaleUpperCase(),
                });
                setInvalidResponsible(false);
              }}
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
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
              setInvalidNewDateLoanFrom(false);
              setInvalidDates(false);
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
              text="Data de Empréstimo é obrigatório"
              className="smaller-text"
            />
          )}
          {invalidDates && (
            <Message
              severity="error"
              text="Data de Empréstimo não pode ser menor que a Data de Devolução"
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
              setInvalidDates(false);
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

export default ToolCreateGenericDialog;
