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
import { TabPanel, TabView } from "primereact/tabview";
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
    header: "Centro de Custo",
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
  const [currReactiveConstruction, setCurrReactiveConstruction] =
    useState<Construction | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showReactiveDialog, setShowReactiveDialog] = useState<boolean>(false);
  const [codeSearch, setCodeSearch] = useState<string>("");
  const [bankBranchSearch, setbankBranchSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Code",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    constructions,
    constructionsNotEnabled,
    loading,
    totalElements,
    totalElementsNotEnabled,
    handleGetConstructions,
    handleGetConstructionsNotEnabled,
    handleGetConstructionById,
    handlePostConstruction,
    handleUpdateConstruction,
    handleDeleteConstruction,
    handleReactiveConstruction,
  } = useContext(ConstructionContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [firstNotEnabled, setFirstNotEnabled] = useState<number>(0);
  const [pageNotEnabled, setPageNotEnabled] = useState<number>(0);
  const router = useRouter();

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onclick: openDialog,
    },
    {
      ariaLabel: "Custos",
      label: "Custos",
      onclick: openCosts,
    },
    {
      ariaLabel: "Ferramentas",
      label: "Ferramentas",
      onclick: openTools,
    },
  ];

  const optionsNotEnabled: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onclick: openDialog,
    },
    {
      ariaLabel: "Custos",
      label: "Custos",
      onclick: openCosts,
    },
    {
      ariaLabel: "Reativar",
      label: "Reativar",
      onclick: openCosts,
    },
  ];

  const columnBodyOptions = {
    options: (constructions: Construction) =>
      optionsBodyTemplate(options, constructions),
  };

  const columnBodyOptionsNotEnabled = {
    options: (constructions: Construction) =>
      optionsBodyTemplate(optionsNotEnabled, constructions),
  };

  async function onUpdateConstruction(construction: Construction) {
    await handleUpdateConstruction(construction);
    handleGetConstructions();
  }

  function openDialog(construction: Construction) {
    setCurrConstruction(construction);
    setShowDialog(true);
  }

  function openDeleteDialog(construction: Construction) {
    setCurrDeleteConstruction(construction);
    setShowDeleteDialog(true);
  }

  function openReactiveDialog(construction: Construction) {
    setCurrReactiveConstruction(construction);
    setShowReactiveDialog(true);
  }

  function closeDeleteDialog() {
    setCurrDeleteConstruction(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  function closeReactiveDialog() {
    setCurrReactiveConstruction(null);
    setShowReactiveDialog((showReactiveDialog) => !showReactiveDialog);
  }

  async function onDeleteConstruction(constructionId: string) {
    await handleDeleteConstruction(constructionId);
    handleGetConstructions(page);
    handleGetConstructionsNotEnabled(page);
  }

  async function onReactiveConstruction(constructionId: string) {
    await handleReactiveConstruction(constructionId);
    handleGetConstructions(page);
    handleGetConstructionsNotEnabled(page);
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrConstruction(null);
  }

  async function openCosts(construction: Construction) {
    await handleGetConstructionById(construction.id);
    router.push(`/centro-custo/${construction.id}/custos`);
  }

  async function openTools(construction: Construction) {
    await handleGetConstructionById(construction.id);
    router.push(`/centro-custo/${construction.id}/ferramentas`);
  }

  async function onCreateConstruction(construction: ConstructionDTO) {
    await handlePostConstruction(construction);
    handleGetConstructions(page);
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetConstructions(page);
    setFirst(first);
    setPage(page);
  }

  function onPageChangeNotEnabled(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetConstructionsNotEnabled(page);
    setFirstNotEnabled(first);
    setPageNotEnabled(page);
  }

  function onCodeSearch(code: string) {
    handleGetConstructions(0, code, bankBranchSearch);
    handleGetConstructionsNotEnabled(0, code, bankBranchSearch);
  }

  function onBankBranchSearch(bankBranch: string) {
    handleGetConstructions(0, codeSearch, bankBranch);
    handleGetConstructionsNotEnabled(0, codeSearch, bankBranch);
  }

  function onChangeCodeSearch(code: string) {
    setCodeSearch(code);
  }

  function onChangeBankBranchSearch(bankBranch: string) {
    setbankBranchSearch(bankBranch);
  }

  return (
    <>
      <section className="flex flex-column gap-2 p-5 w-full">
        <h1 className="m-0">Centros de Custos</h1>
        <div className="flex align-items-center justify-start w-full gap-1">
          <>
            <div className="field flex flex-column gap-1">
              <LabelTitle
                text="Centro de Custo"
                htmlFor="centerCost"
                className="font-semibold smaller-text"
              />
              <InputSearch
                onSearch={onCodeSearch}
                onChange={onChangeCodeSearch}
                inputType={optionType.type}
              />
            </div>
            <div className="field flex flex-column gap-1">
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
          </>
        </div>
        <TabView className="w-full smaller-text">
          <TabPanel header="Ativo">
            <DataTable
              emptyMessage="Nenhuma centro de custo encontrado."
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
          </TabPanel>
          <TabPanel header="Encerrado">
            <DataTable
              emptyMessage="Nenhuma centro de custo encontrado."
              value={constructionsNotEnabled}
              loading={loading}
              stripedRows
              showGridlines
              scrollable
              scrollHeight="85vh"
              rows={10}
              totalRecords={totalElementsNotEnabled}
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
                    className="smaller-text"
                  />
                );
              })}
              <Column
                header="Opções"
                body={columnBodyOptionsNotEnabled.options}
              />
            </DataTable>
            <Paginator
              first={firstNotEnabled}
              rows={10}
              totalRecords={totalElementsNotEnabled}
              onPageChange={onPageChange}
            />
          </TabPanel>
        </TabView>

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
      {currReactiveConstruction && (
        <ConstructionReactiveDialog
          visible={showReactiveDialog}
          data={currReactiveConstruction}
          onReactive={onDeleteConstruction}
          onHide={closeReactiveDialog}
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
              {(role === "Administrador" || el.label !== "Editar") && (
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
