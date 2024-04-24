import InputSearch from "@/components/InputSearch";
import { SupplierContext } from "@/context/SupplierContext";
import { Supplier } from "@/services/supplier/type";
import { Router, useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import SupplierDeleteDialog from "../SupplierDeleteDialog";
import { ToastContext } from "@/context/ToastContext";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onclick: (supplier: Supplier) => void;
}

interface OptionType {
  type: string;
}

const columns = [
  {
    field: "completeName",
    header: "Nome Completo",
  },
  {
    field: "sellerName",
    header: "Nome Vendedor",
  },
  {
    field: "sellerPhone",
    header: "Telefone Vendedor",
  },
  {
    field: "sellerEmail",
    header: "E-mail Vendedor",
  },
];

function SupplierList() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Nome",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [currDeleteSupplier, setCurrDeleteSupplier] = useState<Supplier | null>(
    null
  );
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);

  const {
    suppliers,
    totalElements,
    loading,
    postStatus,
    handleGetSuppliers,
    handleGetSupplierById,
    handleDeleteSupplier,
  } = useContext(SupplierContext);

  const { showToast, toastMessage } = useContext(ToastContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Visualizar",
      label: "Visualizar",
      onclick: openDetailsInfo,
    },
    {
      ariaLabel: "Excluir",
      label: "Excluir",
      onclick: openDeleteDialog,
    },
  ];

  const columnBodyOptions = {
    options: (suppliers: Supplier) => optionsBodyTemplate(options, suppliers),
  };

  async function openDetailsInfo(supplier: Supplier) {
    await handleGetSupplierById(supplier.id);
    router.push(`/fornecedores/${supplier.id}`);
  }

  function openCreatePage() {
    router.push(`/fornecedores/cadastrar`);
  }
  function openDeleteDialog(supplier: Supplier) {
    setCurrDeleteSupplier(supplier);
    setShowDialogDelete((showDeleteDialog) => !showDeleteDialog);
  }

  async function onDeleteSupplier(supplierId: number) {
    await handleDeleteSupplier(supplierId);
    handleGetSuppliers();
  }

  function closeDeleteDialog() {
    setCurrDeleteSupplier(null);
    setShowDialogDelete((showDeleteDialog) => !showDeleteDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetSuppliers(page);
    setFirst(first);
  }

  function onSearch(name: string) {
    handleGetSuppliers(0, name, optionType.type);
  }

  function onChangeSearch(name: string) {
    setNameSearch(name);
  }

  useEffect(() => {
    if (showToast) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Message Content",
        life: 3000,
      });
    }
  }, [showToast]);

  return (
    <>
      <section className="flex flex-column gap-2 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Fornecedores</h1>
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
              openCreatePage();
            }}
          >
            Adicionar
          </Button>
        </div>
        <DataTable
          emptyMessage="Nenhum fornecedor encontrado."
          value={suppliers}
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
        {currDeleteSupplier && (
          <SupplierDeleteDialog
            visible={showDialogDelete}
            data={currDeleteSupplier}
            onDelete={onDeleteSupplier}
            onHide={closeDeleteDialog}
          />
        )}
      </section>
    </>
  );
}

function optionsBodyTemplate(elements: Options[], suppliers: Supplier) {
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
            onClick={() => el.onclick(suppliers)}
          />
        );
      })}
    </div>
  );
}

export default SupplierList;
