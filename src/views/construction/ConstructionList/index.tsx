import InputSearch from "@/components/InputSearch";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { useContext, useRef, useState } from "react";
import ConstructionCreateDialog from "../ConstructionCreateDialog";
import ConstructionUpdateDialog from "../ConstructionUpdateDialog";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import ConstructionDeleteDialog from "../ConstructionDeleteDialog";
import LabelTitle from "@/components/LabelTitle";
import ConstructionReactiveDialog from "../ConstructionReactiveDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onclick: (construction: Construction) => void;
}

interface OptionType {
  type: string;
}

const columns = [
  {
    field: "code",
    header: "Obra",
  },
  {
    field: "client",
    header: "Cliente",
  },
  {
    field: "local",
    header: "Local",
  },
  {
    field: "responsible",
    header: "Resp.",
  },
  {
    field: "service",
    header: "Descrição",
  },
  {
    field: "isCad",
    header: "CAD",
  },
  {
    field: "openingDateFormatted",
    header: "Aberta em",
  },
  {
    field: "closedDateFormatted",
    header: "Encerrada em",
  },

  {
    field: "bankBranch",
    header: "AG",
  },
];

function ConstructionList() {
  const role = Cookies.get("portal.role");
  const [currConstruction, setCurrConstruction] = useState<Construction | null>(
    null
  );
  const [currDeleteConstruction, setCurrDeleteConstruction] =
    useState<Construction | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [codeSearch, setCodeSearch] = useState<string>("");
  const [bankBranchSearch, setBankBranchSearch] = useState<string>("");
  const [localBankSearch, setLocalBankSearch] = useState<string>("");
  const [responsibleSearch, setResponsibleSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Code",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    constructions,
    centerCostNumber,
    loading,
    totalElements,
    handleGetConstructions,
    handleGetConstructionById,
    handleGetCenterCostNumber,
    handlePostConstruction,
    handleUpdateConstruction,
    handleDeleteConstruction,
  } = useContext(ConstructionContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const router = useRouter();

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onclick: openDialog,
    },
    {
      ariaLabel: "Notas",
      label: "Notas",
      onclick: openCosts,
    },
    {
      ariaLabel: "Ferramentas",
      label: "Ferramentas",
      onclick: openTools,
    },
  ];

  const columnBodyOptions = {
    options: (constructions: Construction) =>
      optionsBodyTemplate(options, constructions),
  };

  async function onUpdateConstruction(construction: Construction) {
    await handleUpdateConstruction(construction);
    handleGetConstructions(
      page,
      codeSearch,
      bankBranchSearch,
      localBankSearch,
      responsibleSearch
    );
  }

  function openDialog(construction: Construction) {
    setCurrConstruction(construction);
    setShowDialog(true);
  }

  function openDeleteDialog(construction: Construction) {
    setCurrDeleteConstruction(construction);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setCurrDeleteConstruction(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  async function onDeleteConstruction(constructionId: string) {
    await handleDeleteConstruction(constructionId);
    handleGetConstructions(
      page,
      codeSearch,
      bankBranchSearch,
      localBankSearch,
      responsibleSearch
    );
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrConstruction(null);
  }

  async function openCosts(construction: Construction) {
    await handleGetConstructionById(construction.id);
    router.push(`/obras/${construction.id}/notas`);
  }

  async function openTools(construction: Construction) {
    await handleGetConstructionById(construction.id);
    router.push(`/obras/${construction.id}/ferramentas`);
  }

  async function onCreateConstruction(construction: ConstructionDTO) {
    await handlePostConstruction(construction);
    await handleGetCenterCostNumber();
    handleGetConstructions(
      page,
      codeSearch,
      bankBranchSearch,
      localBankSearch,
      responsibleSearch
    );
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetConstructions(
      page,
      codeSearch,
      bankBranchSearch,
      localBankSearch,
      responsibleSearch
    );
    setFirst(first);
    setPage(page);
  }

  function onCodeSearch(code: string) {
    handleGetConstructions(
      0,
      code,
      bankBranchSearch,
      localBankSearch,
      responsibleSearch
    );
  }

  function onBankBranchSearch(bankBranch: string) {
    handleGetConstructions(
      0,
      codeSearch,
      bankBranch,
      localBankSearch,
      responsibleSearch
    );
  }

  function onLocalBankSearch(localBank: string) {
    handleGetConstructions(
      0,
      codeSearch,
      bankBranchSearch,
      localBank,
      responsibleSearch
    );
  }

  function onResponsibleSearch(responsible: string) {
    handleGetConstructions(
      0,
      codeSearch,
      bankBranchSearch,
      localBankSearch,
      responsible
    );
  }

  function onChangeCodeSearch(code: string) {
    setCodeSearch(code);
  }

  function onChangeBankBranchSearch(bankBranch: string) {
    setBankBranchSearch(bankBranch);
  }

  function onChangeLocalBankSearch(localBank: string) {
    setLocalBankSearch(localBank);
  }

  function onChangeResponsibleSearch(responsible: string) {
    setResponsibleSearch(responsible);
  }

  return (
    <>
      <section className="flex flex-column gap-2 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-1">
          <h1 className="m-0">Obras</h1>
          <div
            className="flex justify-end gap-6 w-full"
            style={{ justifyContent: "end" }}
          >
            {(role === "Administrador" || role === "Notas") && (
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
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Obra"
              htmlFor="centerCost"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onCodeSearch}
              onChange={onChangeCodeSearch}
              inputType={optionType.type}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Agência"
              htmlFor="bankBranch"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onBankBranchSearch}
              onChange={onChangeBankBranchSearch}
              inputType={optionType.type}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Local"
              htmlFor="localBank"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onLocalBankSearch}
              onChange={onChangeLocalBankSearch}
              inputType={optionType.type}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Responsável"
              htmlFor="responsible"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onResponsibleSearch}
              onChange={onChangeResponsibleSearch}
              inputType={optionType.type}
            />
          </div>
        </div>
        <DataTable
          emptyMessage="Nenhuma obra encontrada."
          value={constructions}
          loading={loading}
          stripedRows
          showGridlines
          scrollable
          scrollHeight="85vh"
          rows={10}
          totalRecords={totalElements}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          className="smaller-text"
        >
          {columns.map((col) => {
            return (
              <Column
                sortable
                key={col.field}
                field={col.field}
                header={col.header}
              />
            );
          })}
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />

        {showCreateDialog && (
          <ConstructionCreateDialog
            visible={showCreateDialog}
            onCreate={onCreateConstruction}
            onHide={closeCreateDialog}
          />
        )}
      </section>
      {currConstruction && (
        <ConstructionUpdateDialog
          data={currConstruction}
          onHide={closeDialog}
          visible={showDialog}
          onUpdate={onUpdateConstruction}
        />
      )}
      {currDeleteConstruction && (
        <ConstructionDeleteDialog
          visible={showDeleteDialog}
          data={currDeleteConstruction}
          onDelete={onDeleteConstruction}
          onHide={closeDeleteDialog}
        />
      )}
    </>
  );

  function optionsBodyTemplate(
    elements: Options[],
    constructions: Construction
  ) {
    return (
      <div className="flex gap-2">
        {elements.map((el, index) => {
          return (
            <>
              {(role === "Administrador" ||
                role === "Notas" ||
                el.label !== "Editar") && (
                <Button
                  key={index}
                  icon={el.icon}
                  label={el.label}
                  aria-label={el.ariaLabel}
                  tooltip={el.tooltip}
                  tooltipOptions={{ position: "top", className: "text-xs" }}
                  size="small"
                  severity="danger"
                  onClick={() => el.onclick(constructions)}
                />
              )}
            </>
          );
        })}
      </div>
    );
  }
}

export default ConstructionList;
