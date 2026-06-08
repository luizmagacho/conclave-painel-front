import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { Tool } from "@/services/tool/type";
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
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface ToolUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (tool: Tool) => void;
  data: Tool;
  responsible: string[];
  names: string[];
}

function ToolUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
  responsible,
  names,
}: ToolUpdateDialog) {
  const router = useRouter();
  const userId = localStorage.getItem("portal.id");
  const [updatedTool, setUpdatedTool] = useState<Tool>({
    id: data.id,
    name: data.name,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    bankBranchLocalBank: data.bankBranchLocalBank,
    payer: data.payer,
    typeCenterCost: data.typeCenterCost,
    dateLoanFrom: data.dateLoanFrom,
    dateLoanFromFormatted: data.dateLoanFromFormatted,
    dateLoanTo: data.dateLoanTo,
    dateLoanToFormatted: data.dateLoanToFormatted,
    responsible: data.responsible,
    userId: data.userId,
    enabled: data.enabled,
    additionalDetails: data.additionalDetails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
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
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);
  const [invalidDates, setInvalidDates] = useState<boolean>(false);
  const { allConstructions } = useContext(ConstructionContext);
  const [namesItems, setNamesItems] = useState<string[]>(names);
  const [responsibleItems, setResponsibleItems] =
    useState<string[]>(responsible);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

  useEffect(() => {
    setUpdatedTool((prevTool) => ({
      ...prevTool,
      dateLoanFrom:
        formatDateToYYYYMMDD(updatedDateLoanFrom) || prevTool.dateLoanFrom,
      dateLoanTo: formatDateToYYYYMMDD(updatedDateLoanTo) || "",
    }));

    if (updatedDateLoanTo && updatedDateLoanFrom)
      setInvalidDates(updatedDateLoanTo < updatedDateLoanFrom);
  }, [updatedDateLoanFrom, updatedDateLoanTo]);

  useEffect(() => {
    const fetchConstruction = async () => {
      const relatedConstruction = allConstructions.find(
        (construction) => construction.id === data.centerCostId // Substitua por ID relacionado
      );
      setSelectedConstruction(relatedConstruction);
    };
    fetchConstruction();
  }, []);

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

  function validateFields() {
    setInvalidCenterCost(updatedTool.centerCost === "");
    setUpdatedTool({ ...updatedTool, userId: userId || "" });
    setInvalidName(!updatedTool.name || updatedTool.name === "");
    setInvalidResponsible(
      !updatedTool.responsible && updatedTool.responsible === ""
    );
    setInvalidDateLoanFrom(!updatedDateLoanFrom);

    if (
      !invalidCenterCost &&
      !invalidName &&
      !invalidResponsible &&
      !invalidDateLoanFrom &&
      !invalidDates
    ) {
      onUpdate(updatedTool);
      onHide();
    }
  }

  useEffect(() => {
    setUpdatedTool((prevCost) => ({
      ...prevCost,
      centerCostId: selectedConstruction?.id || "",
      centerCost: selectedConstruction?.code || "",
      bankBranchLocalBank: selectedConstruction?.bankBranch
        ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
        : "",

      typeCenterCost: selectedConstruction?.service || "",
      payer: selectedConstruction?.client || "",
    }));
  }, [selectedConstruction]);

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
            text="Código do Obra"
            htmlFor="code"
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
            htmlFor="branchBank"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedTool?.bankBranchLocalBank}
            disabled={true}
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Ferramenta"
            htmlFor="name"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              value={updatedTool.name}
              suggestions={namesItems}
              completeMethod={namesSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setUpdatedTool({
                  ...updatedTool,
                  name: e.value.toLocaleUpperCase(),
                });
                setInvalidName(false);
              }}
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidName && (
              <Message
                severity="error"
                text="Ferramenta é obrigatória"
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
              value={updatedTool.responsible}
              suggestions={responsibleItems}
              completeMethod={responsibleSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setUpdatedTool({
                  ...updatedTool,
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
              setUpdatedDateLoanFrom(e.value || null);
              setInvalidDateLoanFrom(false);
              setInvalidDates(false);
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
              setUpdatedDateLoanTo(e.value || null);
              setInvalidDates(false);
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
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Memo"
            htmlFor="additionalDetails"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedTool({
                ...updatedTool,
                additionalDetails: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedTool?.additionalDetails}
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
