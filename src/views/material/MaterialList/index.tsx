import { MaterialContext } from "@/context/MaterialContext";
import { Material, MaterialDTO } from "@/services/material/type";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { useContext, useRef, useState } from "react";
import MaterialCreateDialog from "../MaterialCreateDialog";
import InputSearch from "@/components/InputSearch";
import MaterialUpdateDialog from "../MaterialUpdateDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onclick: (material: Material) => void;
}

interface OptionType {
  type: string;
}

const columns = [
  {
    field: "name",
    header: "Nome",
  },
  {
    field: "quantity",
    header: "Quantidade",
  },
  {
    field: "metricUnit",
    header: "Unidade Métrica",
  },
];

function MaterialList() {
  const [currMaterial, setCurrMaterial] = useState<Material | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Nome",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    materials,
    loading,
    totalElements,
    handleGetMaterials,
    handlePostMaterial,
    handleUpdateMaterial,
  } = useContext(MaterialContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onclick: openDialog,
    },
  ];

  const columnBodyOptions = {
    options: (materials: Material) => optionsBodyTemplate(options, materials),
  };

  function openDialog(material: Material) {
    setCurrMaterial(material);
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrMaterial(null);
  }

  async function onUpdateMaterial(material: Material) {
    await handleUpdateMaterial(material);
    handleGetMaterials();
  }

  async function onCreateMaterial(material: MaterialDTO) {
    await handlePostMaterial(material);
    handleGetMaterials();
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetMaterials(page);
    setFirst(first);
  }

  function onSearch(name: string) {
    handleGetMaterials(0, name, optionType.type);
  }

  function onChangeSearch(name: string) {
    setNameSearch(name);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Materiais</h1>
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
          emptyMessage="Nenhum material encontrado."
          value={materials}
          loading={loading}
          stripedRows
          showGridlines
          scrollable
          scrollHeight="85vh"
          rows={15}
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
                className="smaller-text"
              />
            );
          })}
          <Column
            header="Opções"
            body={columnBodyOptions.options}
            className="smaller-text"
          />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        {showCreateDialog && (
          <MaterialCreateDialog
            visible={showCreateDialog}
            onCreate={onCreateMaterial}
            onHide={closeCreateDialog}
          />
        )}
      </section>
      {currMaterial && (
        <MaterialUpdateDialog
          data={currMaterial}
          visible={showDialog}
          onUpdate={onUpdateMaterial}
          onHide={closeDialog}
        />
      )}
    </>
  );
}

function optionsBodyTemplate(elements: Options[], materials: Material) {
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
            onClick={() => el.onclick(materials)}
          />
        );
      })}
    </div>
  );
}

export default MaterialList;
