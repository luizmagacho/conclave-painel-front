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
  const [currConstruction, setCurrConstruction] = useState<Construction | null>(
    null
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Code",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    constructions,
    loading,
    totalElements,
    handleGetConstructions,
    handleGetConstructionById,
    handlePostConstruction,
    handleUpdateConstruction,
  } = useContext(ConstructionContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
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
  ];

  const columnBodyOptions = {
    options: (constructions: Construction) =>
      optionsBodyTemplate(options, constructions),
  };

  async function onUpdateConstruction(construction: Construction) {
    await handleUpdateConstruction(construction);
    handleGetConstructions();
  }

  function openDialog(construction: Construction) {
    setCurrConstruction(construction);
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrConstruction(null);
  }

  async function openCosts(construction: Construction) {
    await handleGetConstructionById(construction.id);
    router.push(`/centro-custo/${construction.id}/custos`);
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

  function onSearch(name: string) {
    handleGetConstructions(0, name, optionType.type);
  }

  function onChangeSearch(name: string) {
    setNameSearch(name);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Centros de Custos</h1>
          <InputSearch
            onSearch={onSearch}
            onChange={onChangeSearch}
            inputType={optionType.type}
          />
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
        </div>
        <DataTable
          emptyMessage="Nenhuma centro de custo encontrado."
          value={constructions}
          loading={loading}
          stripedRows
          showGridlines
          rows={10}
          totalRecords={totalElements}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
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
          );
        })}
      </div>
    );
  }
}

export default ConstructionList;
