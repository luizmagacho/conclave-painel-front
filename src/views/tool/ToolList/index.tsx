import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { ToolContext } from "@/context/ToolContext";
import { Tool, ToolDTO } from "@/services/tool/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useContext, useEffect, useState } from "react";
import ToolUpdateDialog from "../ToolUpdateDialog";
import ToolCreateGenericDialog from "../ToolCreateGenericDialog";
import ToolDeleteDialog from "../ToolDeleteDialog";
import { classNames } from "primereact/utils";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { ScrollPanel } from "primereact/scrollpanel";
import { TabPanel, TabView } from "primereact/tabview";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (tool: Tool) => void;
}

interface OptionType {
  type: string;
}

function ToolList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currTool, setCurrTool] = useState<Tool | null>(null);
  const [currDeleteTool, setCurrDeleteTool] = useState<Tool | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [responsibleSearch, setResponsibleSearch] = useState<string>("");
  const [codeSearch, setCodeSearch] = useState<string>("");
  const [bankBranchLocalBankSearch, setBankBranchLocalBankSearch] =
    useState<string>("");
  const [returned, setReturned] = useState<boolean>(false);

  const {
    tools,
    loading,
    totalElements,
    listNames,
    listResponsible,
    handleGetTools,
    handlePostTool,
    handleUpdateTool,
    handleDeleteTool,
    handleGetAllNames,
    handleGetAllResponsible,
  } = useContext(ToolContext);

  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onClick: openDialog,
    },
    {
      ariaLabel: "Excluir",
      label: "Excluir",
      onClick: openDeleteDialog,
    },
  ];

  const columnBodyOptions = {
    options: (tool: Tool) => optionsBodyTemplate(options, tool),
  };

  function openDialog(tool: Tool) {
    setCurrTool(tool);
    setShowDialog(true);
  }

  function openDeleteDialog(tool: Tool) {
    setCurrDeleteTool(tool);
    setShowDeleteDialog(true);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    const { id } = router.query;
    handleGetTools(
      page,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
    setFirst(first);
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function closeDeleteDialog() {
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  function closeUpdatedDialog() {
    setCurrTool(null);
    setShowDialog((showDialog) => !showDialog);
  }

  useEffect(() => {
    handleGetTools();
    handleGetAllNames();
    handleGetAllResponsible();
  }, [handleGetTools, handleGetAllNames, handleGetAllResponsible]);

  async function onCreateTool(tool: ToolDTO) {
    await handlePostTool(tool);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
    handleGetAllNames();
    handleGetAllResponsible();
  }

  async function onDeleteTool(toolId: string) {
    await handleDeleteTool(toolId);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
  }

  async function onUpdatedTool(tool: Tool) {
    await handleUpdateTool(tool);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
    handleGetAllNames();
    handleGetAllResponsible();
  }

  function onNameSearch(name: string) {
    handleGetTools(
      0,
      name,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
  }

  function onResponsibleSearch(responsible: string) {
    handleGetTools(
      0,
      nameSearch,
      responsible,
      codeSearch,
      bankBranchLocalBankSearch,
      returned
    );
  }

  function onChangeNameSearch(name: string) {
    setNameSearch(name);
  }

  function onChangeResponsibleSearch(responsible: string) {
    setResponsibleSearch(responsible);
  }

  function onCodeSearch(code: string) {
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      code,
      bankBranchLocalBankSearch,
      returned
    );
  }

  function onBankBranchLocalBankSearch(bankBranchLocalBank: string) {
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBank,
      returned
    );
  }

  function onChangeCodeSearch(code: string) {
    setCodeSearch(code);
  }

  function onChangeBankBranchLocalBankSearch(bankBranchLocalBank: string) {
    setBankBranchLocalBankSearch(bankBranchLocalBank);
  }

  function onReturnedChange(event: CheckboxChangeEvent) {
    setReturned(event.checked ? true : false);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch,
      event.checked ? true : false
    );
  }

  const clearedBodyTemplate = (tool: Tool) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": tool.isFinishedConstruction,
          "false-icon pi-times-circle": !tool.isFinishedConstruction,
        })}
      ></i>
    );
  };

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-1">
          <h1 className="m-0">Ferramentas</h1>
          <div
            className="flex justify-end gap-6 w-full"
            style={{ justifyContent: "end" }}
          >
            {(role === "Administrador" ||
              role === "Notas" ||
              role === "Contas") && (
              <Button
                style={{
                  backgroundColor: "var(--cor-primaria)",
                  border: "1px solid var(--cor-primaria)",
                }}
                onClick={() => {
                  setShowCreateDialog(true);
                }}
              >
                Adicionar
              </Button>
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome"
              htmlFor="name"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onNameSearch}
              onChange={onChangeNameSearch}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Responsável"
              htmlFor="responsible"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onResponsibleSearch}
              onChange={onChangeResponsibleSearch}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Obra"
              htmlFor="centerCost"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onCodeSearch}
              onChange={onChangeCodeSearch}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Agência"
              htmlFor="bankBranchLocalBank"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onBankBranchLocalBankSearch}
              onChange={onChangeBankBranchLocalBankSearch}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Não devolvido"
              htmlFor="returned"
              className="font-semibold smaller-text"
            />
            <Checkbox
              inputId="returned"
              onChange={onReturnedChange}
              checked={returned === true}
            />
          </div>
        </div>
        <ScrollPanel style={{ width: "100%", height: "80%" }}>
          {/* <TabView className="w-full smaller-text">
            <TabPanel header="Empréstimo"> */}
          <DataTable
            emptyMessage="Nenhuma ferramenta encontrada."
            value={tools}
            loading={loading}
            stripedRows
            showGridlines
            rows={15}
            tableStyle={{ minWidth: "30rem" }}
            totalRecords={totalElements}
            size="small"
          >
            <Column field="name" header="Nome" />
            <Column field="responsible" header="Responsável" />
            <Column field="dateLoanFromFormatted" header="Data de Empréstimo" />
            <Column field="dateLoanToFormatted" header="Data de Devolução" />
            <Column field="centerCost" header="Obra" />
            <Column field="bankBranchLocalBank" header="Agência" />
            <Column body={clearedBodyTemplate} header="Obra Finalizada?" />
            <Column field="additionalDetails" header="Memo" />

            <Column header="Opções" body={columnBodyOptions.options} />
          </DataTable>
          <Paginator
            first={first}
            rows={10}
            totalRecords={totalElements}
            onPageChange={onPageChange}
          />
          {/* </TabPanel> */}
          {/* <TabPanel header="Ferramentas">
          <DataTable
            emptyMessage="Nenhuma ferramenta encontrada."
            value={listNames}
            loading={loading}
            stripedRows
            showGridlines
            rows={15}
            tableStyle={{ minWidth: "30rem" }}
            totalRecords={totalElements}
            size="small"
          ></DataTable>
          </TabPanel> */}
          {/* </TabView> */}
        </ScrollPanel>
      </section>
      {showCreateDialog && (
        <ToolCreateGenericDialog
          visible={showCreateDialog}
          onCreate={onCreateTool}
          onHide={closeCreateDialog}
          names={listNames}
          responsible={listResponsible}
        />
      )}
      {currTool && (
        <ToolUpdateDialog
          visible={showDialog}
          onUpdate={onUpdatedTool}
          onHide={closeUpdatedDialog}
          data={currTool}
          names={listNames}
          responsible={listResponsible}
        />
      )}
      {currDeleteTool && (
        <ToolDeleteDialog
          visible={showDeleteDialog}
          onDelete={onDeleteTool}
          onHide={closeDeleteDialog}
          data={currDeleteTool}
        />
      )}
    </>
  );

  function optionsBodyTemplate(elements: Options[], tool: Tool) {
    return (
      <div className="flex gap-2">
        {elements.map((el, index) => {
          return (
            <Button
              key={index}
              icon={el.icon}
              label={el.label}
              aria-label={el.ariaLabel}
              tooltip={el.tooltip}
              tooltipOptions={{ position: "top", className: "text-xs" }}
              size="small"
              severity="danger"
              onClick={() => el.onClick(tool)}
            />
          );
        })}
      </div>
    );
  }
}

export default ToolList;
