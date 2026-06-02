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
import ToolDeleteDialog from "../ToolDeleteDialog";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import InputSearch from "@/components/InputSearch";

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

function ToolListCenterCost() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currTool, setCurrTool] = useState<Tool | null>(null);
  const [currDeleteTool, setCurrDeleteTool] = useState<Tool | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [responsibleSearch, setResponsibleSearch] = useState<string>("");
  const [returned, setReturned] = useState<boolean>(false);
  const {
    tools,
    loading,
    totalElements,
    listNames,
    listResponsible,
    handleGetToolsByCenterCostId,
    handlePostTool,
    handleUpdateTool,
    handleDeleteTool,
    handleGetAllNames,
    handleGetAllResponsible,
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
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      page,
      nameSearch,
      responsibleSearch,
      returned
    );
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
    handleGetAllNames();
    handleGetAllResponsible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { id } = router.query;

  useEffect(() => {
    if (router.isReady && typeof id === "string") {
      handleGetConstructionById(id);
      handleGetToolsByCenterCostId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    id,
  ]);

  async function onCreateTool(tool: ToolDTO) {
    await handlePostTool(tool);
    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      nameSearch,
      responsibleSearch,
      returned
    );
    handleGetConstructionById(typeof id === "string" ? id : "");
    handleGetAllNames();
    handleGetAllResponsible();
  }

  async function onDeleteTool(toolId: string) {
    await handleDeleteTool(toolId);
    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      nameSearch,
      responsibleSearch,
      returned
    );
    handleGetConstructionById(typeof id === "string" ? id : "");
  }

  async function onUpdatedTool(tool: Tool) {
    await handleUpdateTool(tool);

    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      nameSearch,
      responsibleSearch,
      returned
    );
    handleGetConstructionById(typeof id === "string" ? id : "");
    handleGetAllNames();
    handleGetAllResponsible();
  }

  function onChangeNameSearch(name: string) {
    setNameSearch(name);
  }

  function onChangeResponsibleSearch(responsible: string) {
    setResponsibleSearch(responsible);
  }

  function onNameSearch(name: string) {
    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      name,
      responsibleSearch,
      returned
    );
  }

  function onResponsibleSearch(responsible: string) {
    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      nameSearch,
      responsible,
      returned
    );
  }

  function onReturnedChange(event: CheckboxChangeEvent) {
    setReturned(event.checked ? true : false);
    const { id } = router.query;
    handleGetToolsByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      nameSearch,
      responsibleSearch,
      event.checked
    );
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Ferramentas</h1>
        </div>
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="flex flex-column gap-1 w-full">
            <LabelTitle
              text={`Obra: ${selectedConstruction?.code}`}
              htmlFor="neighborhood"
              className="font-semibold"
            />
          </div>
          <div className="flex flex-column gap-1 w-full">
            <LabelTitle
              text={`Agência: ${selectedConstruction?.bankBranch}`}
              htmlFor="neighborhood"
              className="font-semibold"
            />
          </div>
          <div className="flex flex-column gap-1 w-full">
            <LabelTitle
              text={`Local: ${selectedConstruction?.local}`}
              htmlFor="neighborhood"
              className="font-semibold"
            />
          </div>
          <div className="flex flex-column gap-1 w-full">
            <LabelTitle
              text={`Serviço: ${selectedConstruction?.service}`}
              htmlFor="neighborhood"
              className="font-semibold"
            />
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
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
          <div className="flex flex-column gap-1 w-full">
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
          <Column field="name" header="Ferramenta" />
          <Column field="responsible" header="Responsável" />
          <Column field="dateLoanFromFormatted" header="Data de Empréstimo" />
          <Column field="dateLoanToFormatted" header="Data de Devolução" />
          <Column field="additionalDetails" header="Memo" />
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        <div
          className="flex justify-end gap-6 w-full"
          style={{ justifyContent: "end" }}
        >
          <Button
            className="font-semibold text-sm"
            label="Cancelar"
            outlined
            onClick={() => {
              router.back();
            }}
          />
          <Button
            onClick={() => {
              setShowCreateDialog(true);
            }}
            className="rounded-md px-3 text-sm"
            label="Adicionar"
            severity="danger"
          />
        </div>
        {showCreateDialog && (
          <ToolCreateDialog
            onCreate={onCreateTool}
            onHide={closeCreateDialog}
            visible={showCreateDialog}
            names={listNames}
            responsible={listResponsible}
          />
        )}
        {currTool && (
          <ToolUpdateDialog
            onUpdate={onUpdatedTool}
            onHide={closeUpdatedDialog}
            visible={showDialog}
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
      </section>
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

export default ToolListCenterCost;
