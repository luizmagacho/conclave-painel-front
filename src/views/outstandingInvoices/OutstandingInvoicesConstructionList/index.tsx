import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
} from "@/services/outstanding-invoices/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { classNames } from "primereact/utils";
import { useContext, useEffect, useState } from "react";
import OutstadingInvoicesConstructionCreateDialog from "../OutstadingInvoicesConstructionCreateDialog";
import { SupplierContext } from "@/context/SupplierContext";
import OutstandingInvoicesDeleteDialog from "../OutstandingInvoicesDeleteDialog";
import OutstandingConstructionUpdateDialog from "../OutstadingConstructionUpdateDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (outstandingInvoices: OutstandingInvoices) => void;
}

interface OptionType {
  type: string;
}

function OutstandingInvoicesConstructionList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currOutstandingInvoices, setCurrOutstandingInvoices] =
    useState<OutstandingInvoices | null>(null);
  const [currDeleteOutstandingInvoices, setCurrDeleteOutstandingInvoices] =
    useState<OutstandingInvoices | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [vendorNameSearch, setVendorNameSearch] = useState<string>("");
  const [paymentDeadlineFromSearch, setPaymentDeadlineFromSearch] =
    useState<string>("");
  const [paymentDeadlineToSearch, setPaymentDeadlineToSearch] =
    useState<string>("");
  const {
    outstandingInvoices,
    loading,
    totalElements,
    handleGetOutstandingInvoicesByCenterCostId,
    handlePostOutstandingInvoices,
    handleUpdateOutstandingInvoices,
    handleGetAllCategories,
    handleDeleteOutstandingInvoices,
  } = useContext(OutstandingInvoicesContext);

  const { handleGetAllShortenedName } = useContext(SupplierContext);

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
    options: (outstandingInvoices: OutstandingInvoices) =>
      optionsBodyTemplate(options, outstandingInvoices),
  };

  function openDialog(outstandingInvoices: OutstandingInvoices) {
    setCurrOutstandingInvoices(outstandingInvoices);
    setShowDialog(true);
  }

  function openDeleteDialog(outstandingInvoices: OutstandingInvoices) {
    setCurrDeleteOutstandingInvoices(outstandingInvoices);
    setShowDeleteDialog(true);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      page
    );
    setFirst(first);
  }

  async function onCreateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoicesDTO
  ) {
    await handlePostOutstandingInvoices(outstandingInvoices);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : ""
    );
    handleGetConstructionById(typeof id === "string" ? id : "");
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onUpateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoices
  ) {
    await handleUpdateOutstandingInvoices(outstandingInvoices);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineFromSearch
    );
    handleGetAllCategories();
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrOutstandingInvoices(null);
  }

  async function onDeleteOutstandingInvoices(outstandingInvoicesId: string) {
    const { id } = router.query;
    await handleDeleteOutstandingInvoices(outstandingInvoicesId);
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : ""
    );
  }

  function closeDeleteDialog() {
    setCurrDeleteOutstandingInvoices(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  useEffect(() => {
    const { id } = router.query;
    handleGetConstructionById(typeof id === "string" ? id : "");
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : ""
    );
  }, []);

  const clearedBodyTemplate = (outstandingInvoices: OutstandingInvoices) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": outstandingInvoices.paymentStatus,
        })}
      ></i>
    );
  };

  const priceTotalValueBodyTemplate = (
    outstandingInvoices: OutstandingInvoices
  ) => {
    return formatCurrency(outstandingInvoices.totalAmount || null);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    handleGetAllShortenedName();
  }, []);

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Contas a Pagar</h1>
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
        <DataTable
          emptyMessage="Nenhum custo encontrado."
          value={outstandingInvoices}
          loading={loading}
          stripedRows
          showGridlines
          rows={15}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={totalElements}
          size="small"
        >
          <Column
            field="paymentDeadlineFormatted"
            header="Data de Vencimento"
            className="smaller-text"
          />
          <Column
            field="vendorName"
            header="Favorecido"
            className="smaller-text"
          />
          <Column
            field="cleared"
            header="C"
            className="smaller-text"
            body={clearedBodyTemplate}
          />
          <Column field="centerCost" header="Obra" className="smaller-text" />
          <Column
            field="additionalDetails"
            header="Memo"
            className="smaller-text"
          />

          <Column
            field="totalAmount"
            body={priceTotalValueBodyTemplate}
            header="Valor"
            className="smaller-text"
          />

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
          {(role === "Administrador" || role === "Contas") && (
            <Button
              onClick={() => {
                setShowCreateDialog(true);
              }}
              className="rounded-md px-3 text-sm"
              label="Adicionar"
              severity="danger"
            />
          )}
        </div>
        {showCreateDialog && (
          <OutstadingInvoicesConstructionCreateDialog
            visible={showCreateDialog}
            onHide={closeCreateDialog}
            onCreate={onCreateOutstandingInvoices}
          />
        )}
        {currOutstandingInvoices && (
          <OutstandingConstructionUpdateDialog
            visible={showDialog}
            onHide={closeUpdateDialog}
            onUpdate={onUpateOutstandingInvoices}
            data={currOutstandingInvoices}
          />
        )}
        {currDeleteOutstandingInvoices && (
          <OutstandingInvoicesDeleteDialog
            visible={showDeleteDialog}
            data={currDeleteOutstandingInvoices}
            onDelete={onDeleteOutstandingInvoices}
            onHide={closeDeleteDialog}
          />
        )}
      </section>
    </>
  );

  function optionsBodyTemplate(
    elements: Options[],
    outstandingInvoices: OutstandingInvoices
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
              onClick={() => el.onClick(outstandingInvoices)}
            />
          );
        })}
      </div>
    );
  }
}

export default OutstandingInvoicesConstructionList;
