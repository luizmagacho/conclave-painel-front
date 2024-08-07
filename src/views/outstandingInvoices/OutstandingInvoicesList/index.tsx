import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { classNames } from "primereact/utils";
import { useContext, useEffect, useState } from "react";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
} from "@/services/outstanding-invoices/type";
import OutstandingInvoicesDialog from "../OutstandingInvoicesDialog";
import OutstandingInvoicesCreateDialog from "../OutstandingInvoicesCreateDialog";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import OutstandingInvoicesDeleteDialog from "../OutstandingInvoicesDeleteDialog";

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

function OutstandingInvoicesList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currOutstandingInvoices, setCurrOutstandingInvoices] =
    useState<OutstandingInvoices | null>(null);
  const [currDeleteOutstandingInvoices, setCurrDeleteOutstandingInvoices] =
    useState<OutstandingInvoices | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const {
    outstandingInvoices,
    loading,
    totalElements,
    handleGetOutstandingInvoices,
    handlePostOutstandingInvoices,
    handleUpdateOutstandingInvoices,
    handleDeleteOutstandingInvoices,
  } = useContext(OutstandingInvoicesContext);

  const [centerCostSearch, setCenterCostSearch] = useState<string>("");
  const [localBranchSearch, setLocalBranchSearch] = useState<string>("");
  const [vendorNameSearch, setVendorNameSearch] = useState<string>("");
  const [paymentDeadlineFromSearch, setPaymentDeadlineFromSearch] =
    useState<string>("");
  const [paymentDeadlineToSearch, setPaymentDeadlineToSearch] =
    useState<string>("");

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

  async function onCreateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoicesDTO
  ) {
    await handlePostOutstandingInvoices(outstandingInvoices);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineFromSearch
    );
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function openDialog(outstandingInvoices: OutstandingInvoices) {
    setCurrOutstandingInvoices(outstandingInvoices);
    setShowDialog(true);
  }

  function openDeleteDialog(outstandingInvoices: OutstandingInvoices) {
    setCurrDeleteOutstandingInvoices(outstandingInvoices);
    setShowDeleteDialog(true);
  }

  async function onUpateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoices
  ) {
    await handleUpdateOutstandingInvoices(outstandingInvoices);
    handleGetOutstandingInvoices();
  }

  async function onDeleteOutstandingInvoices(outstandingInvoicesId: string) {
    await handleDeleteOutstandingInvoices(outstandingInvoicesId);
    handleGetOutstandingInvoices();
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrOutstandingInvoices(null);
  }

  function closeDeleteDialog() {
    setCurrDeleteOutstandingInvoices(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetOutstandingInvoices();
    setFirst(first);
  }

  const clearedBodyTemplate = (outstandingInvoices: OutstandingInvoices) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": outstandingInvoices.paymentStatus,
          "false-icon pi-times-circle": !outstandingInvoices.paymentStatus,
        })}
      ></i>
    );
  };

  function onCenterCostSearch(centerCost: string) {
    handleGetOutstandingInvoices(
      0,
      centerCost,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch
    );
  }

  function onChangeCenterCost(centerCost: string) {
    setCenterCostSearch(centerCost);
  }

  function onLocalBranchSearch(localBranch: string) {
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch
    );
  }

  function onChangeLocalBranch(localBranch: string) {
    setLocalBranchSearch(localBranch);
  }

  function onVendorNameSearch(vendorName: string) {
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorName,
      paymentDeadlineFromSearch,
      paymentDeadlineFromSearch
    );
  }

  function onChangeVendorName(vendorName: string) {
    setVendorNameSearch(vendorName);
  }

  function onPaymentDeadlineFromSearch(paymentDeadlineFrom: string) {
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch
    );
  }

  function onChangePaymentDeadlineFrom(paymentDeadlineFrom: string) {
    setPaymentDeadlineFromSearch(paymentDeadlineFrom);
  }

  function onPaymentDeadlineToSearch(paymentDeadlineTo: string) {
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo
    );
  }

  function onChangePaymentDeadlineTo(paymentDeadlineTo: string) {
    setPaymentDeadlineToSearch(paymentDeadlineTo);
  }

  const priceTotalValueBodyTemplate = (
    outstandingInvoices: OutstandingInvoices
  ) => {
    return formatCurrency(outstandingInvoices.totalAmount || null);
  };

  useEffect(() => {
    handleGetOutstandingInvoices();
  }, []);

  const formatCurrency = (value: number | null) => {
    if (!value) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Contas a Pagar</h1>
          {(role === "Administrador" || role === "Notas") && (
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
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Centro de Custo"
              htmlFor="centerCost"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onCenterCostSearch}
              onChange={onChangeCenterCost}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Local Agência"
              htmlFor="localBranch"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onLocalBranchSearch}
              onChange={onChangeLocalBranch}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Favorecido"
              htmlFor="vendorName"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onVendorNameSearch}
              onChange={onChangeVendorName}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="De:"
              htmlFor="paymentDeadlineFrom"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onPaymentDeadlineFromSearch}
              onChange={onChangePaymentDeadlineFrom}
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Até:"
              htmlFor="paymentDeadlineTo"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onPaymentDeadlineToSearch}
              onChange={onChangePaymentDeadlineTo}
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
          className="smaller-text"
        >
          <Column
            field="centerCost"
            header="Centro de Custo"
            className="smaller-text"
          />
          <Column
            field="localBank"
            header="Local da Agência"
            className="smaller-text"
          />

          <Column
            field="vendorName"
            header="Favorecido"
            className="smaller-text"
          />
          <Column
            field="paymentDeadlineFormatted"
            header="Data de Vencimento"
            className="smaller-text"
          />

          <Column
            field="costType"
            header="Categoria"
            className="smaller-text"
          />
          <Column
            field="totalAmount"
            body={priceTotalValueBodyTemplate}
            header="Valor"
            className="smaller-text"
          />
          <Column
            field="cleared"
            header="C"
            className="smaller-text"
            body={clearedBodyTemplate}
          />
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        {showCreateDialog && (
          <OutstandingInvoicesCreateDialog
            visible={showCreateDialog}
            onHide={closeCreateDialog}
            onCreate={onCreateOutstandingInvoices}
          />
        )}
        {currOutstandingInvoices && (
          <OutstandingInvoicesDialog
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

export default OutstandingInvoicesList;
