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
import ToolCreateDialog from "../ToolCreateDialog";
import ToolUpdateDialog from "../ToolUpdateDialog";
import ToolCreateGenericDialog from "../ToolCreateGenericDialog";
import ToolDeleteDialog from "../ToolDeleteDialog";

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

  const {
    tools,
    loading,
    totalElements,
    handleGetTools,
    handlePostTool,
    handleUpdateTool,
    handleDeleteTool,
  } = useContext(ToolContext);

  const { selectedConstruction, handleGetConstructionById } =
    useContext(ConstructionContext);

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
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function closeDeleteDialog() {
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  function closeUpdatedDialog() {
    setShowDialog((showDialog) => !showDialog);
  }

  useEffect(() => {
    const { id } = router.query;
    handleGetTools();
  }, []);

  async function onCreateTool(tool: ToolDTO) {
    await handlePostTool(tool);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch
    );
  }

  async function onDeleteTool(toolId: string) {
    await handleDeleteTool(toolId);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch
    );
  }

  async function onUpdatedTool(tool: Tool) {
    await handleUpdateTool(tool);
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch
    );
  }

  function onNameSearch(name: string) {
    handleGetTools(
      0,
      name,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBankSearch
    );
  }

  function onResponsibleSearch(responsible: string) {
    handleGetTools(
      0,
      nameSearch,
      responsible,
      codeSearch,
      bankBranchLocalBankSearch
    );
  }

  function onChangeNameearch(name: string) {
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
      bankBranchLocalBankSearch
    );
  }

  function onBankBranchLocalBankSearch(bankBranchLocalBank: string) {
    handleGetTools(
      0,
      nameSearch,
      responsibleSearch,
      codeSearch,
      bankBranchLocalBank
    );
  }

  function onChangeCodeSearch(code: string) {
    setCodeSearch(code);
  }

  function onChangeBankBranchLocalBankSearch(bankBranchLocalBank: string) {
    setBankBranchLocalBankSearch(bankBranchLocalBank);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-1">
          <h1 className="m-0">Ferramentas</h1>
          <div
            className="flex justify-end gap-6 w-full"
            style={{ justifyContent: "end" }}
          >
            {role === "Administrador" && (
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
            <InputSearch onSearch={onNameSearch} onChange={onChangeNameearch} />
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
              text="Centro de Custo"
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
        </div>
        <DataTable
          emptyMessage="Nenhuma ferramenta encontrada."
          value={tools}
          loading={loading}
          stripedRows
          showGridlines
          rows={15}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={totalElements}
          size="small"
        >
          <Column field="name" header="Nome" />
          <Column field="responsible" header="Responsável" />
          <Column field="dateLoanFromFormatted" header="Data de Empréstimo" />
          <Column field="dateLoanToFormatted" header="Data de Devolução" />
          <Column field="centerCost" header="Centro de Custo" />
          <Column field="bankBranchLocalBankLocalBank" header="Agência" />

          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
      </section>
      {showCreateDialog && (
        <ToolCreateGenericDialog
          visible={showCreateDialog}
          onCreate={onCreateTool}
          onHide={closeCreateDialog}
        />
      )}
      {currTool && (
        <ToolUpdateDialog
          visible={showDialog}
          onUpdate={onUpdatedTool}
          onHide={closeUpdatedDialog}
          data={currTool}
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
