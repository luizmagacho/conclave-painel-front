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

import * as XLSX from "xlsx";
import { Calendar } from "primereact/calendar";
import InputSearch from "@/components/InputSearch";
import { formatDateToYYYYMMDD, formatarDataBR } from "@/util/date";

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
  const [additionalDetailsSearch, setAdditionalDetailsSearch] =
    useState<string>("");
  const [paymentDeadlineFromSearch, setPaymentDeadlineFromSearch] =
    useState<string>("");
  const [paymentDeadlineToSearch, setPaymentDeadlineToSearch] =
    useState<string>("");

  const [paymentDeadlineFrom, setPaymentDeadlineFrom] = useState<Date | null>();
  const [paymentDeadlineTo, setPaymentDeadlineTo] = useState<Date | null>();

  const {
    outstandingInvoices,
    outstandingInvoicesVendorExport,
    loading,
    totalElements,
    sumTotalValue,
    handleGetOutstandingInvoicesByCenterCostId,
    handleGetOutstandingInvoicesToExport,
    handlePostOutstandingInvoices,
    handleUpdateOutstandingInvoices,
    handleGetAllCategories,
    handleDeleteOutstandingInvoices,
    handleSumTotalValueByFilter,
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
      page,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
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
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
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

  function onVendorNameSearch(vendorName: string) {
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorName,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorName,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onChangeVendorName(vendorName: string) {
    setVendorNameSearch(vendorName);
  }

  function onPaymentDeadlineFromSearch(paymentDeadlineFrom: string) {
    setPaymentDeadlineFromSearch(paymentDeadlineFrom);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onChangePaymentDeadlineFrom(paymentDeadlineFrom: string) {
    setPaymentDeadlineFromSearch(paymentDeadlineFrom);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onPaymentDeadlineToSearch(paymentDeadlineTo: string) {
    setPaymentDeadlineToSearch(paymentDeadlineTo);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );
  }

  function onChangePaymentDeadlineTo(paymentDeadlineTo: string) {
    setPaymentDeadlineToSearch(paymentDeadlineTo);
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );

    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );
  }

  function onAdditionalDetailsSearch(additionalDetails: string) {
    const { id } = router.query;
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : "",
      0,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineFromSearch,
      additionalDetails
    );
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetails
    );
  }

  function onChangeAditionalDetails(additionalDetails: string) {
    setAdditionalDetailsSearch(additionalDetails);
  }

  useEffect(() => {
    const { id } = router.query;
    handleGetConstructionById(typeof id === "string" ? id : "");
    handleGetOutstandingInvoicesByCenterCostId(
      typeof id === "string" ? id : ""
    );
  }, []);

  useEffect(() => {
    handleSumTotalValueByFilter(
      selectedConstruction?.code,
      selectedConstruction?.local,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }, [selectedConstruction]);

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
    return formatCurrency(outstandingInvoices.totalAmount || 0);
  };

  const formatCurrency = (value: number) => {
    if (value < 0) {
      return "-";
    }
    if (value === 0) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    handleGetAllShortenedName();
  }, []);

  function onClickExport() {
    handleGetOutstandingInvoicesToExport(
      0,
      selectedConstruction?.code,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  useEffect(() => {
    if (outstandingInvoicesVendorExport.length > 0) {
      const sheetData: (string | number)[][] = [];
      let sumTotal = 0;
      sheetData.push([
        "Despesas dos Favorecidos",
        "",
        "",
        "",
        "",
        `Data: ${formatarDataBR(new Date())}`,
      ]);
      sheetData.push([
        selectedConstruction?.code
          ? "Obra " +
            selectedConstruction?.code +
            " - " +
            outstandingInvoices[0].localBank
          : "Todas as obras",
      ]);
      sheetData.push([outstandingInvoicesVendorExport[0].periodOfDate]);
      sheetData.push([]);
      // Add a row for the favorecido's name

      // Add headers for invoices
      sheetData.push([
        "Data",
        "Favorecido",
        "C",
        "Conta",
        "Memo",
        "Montante",
        "Categoria",
      ]);
      outstandingInvoicesVendorExport.forEach((favorecido) => {
        // Add rows for each invoice
        favorecido.outstandingInvoices.forEach((invoice) => {
          sheetData.push([
            invoice.paymentDeadlineFormatted || "",
            invoice.vendorName || "",
            invoice.paymentStatus ? "C" : "",
            `${invoice.centerCost || ""} - ${invoice.localBank}`,
            invoice.additionalDetails || "",
            invoice.totalAmount
              ? ((invoice.totalAmount / 100) * -1).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0,00",
            invoice.costCategory ? invoice.costCategory : "-",
          ]);
          sumTotal += invoice.totalAmount || 0;
        });

        sheetData.push([
          "",
          "",
          "",
          "",
          "",
          `${((favorecido.sumAmount / 100) * -1).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        ]);
        // Add a blank row after each favorecido's data
        sheetData.push([]);
      });
      sheetData.push([]);
      sheetData.push([
        "",
        "",
        "",
        "",
        "",
        `${((sumTotal / 100) * -1).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      ]);

      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 3 },
        { wch: 20 },
        { wch: 50 },
        { wch: 15 },
      ];

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet);

      // Generate and download the Excel file
      XLSX.writeFile(workbook, "Relatório.xlsx");
    }
  }, [outstandingInvoicesVendorExport]);

  const headerTemplate = () => {
    return (
      <div className="flex w-full">
        <div className="ml-auto">
          <LabelTitle
            text={`Total Soma: ${formatCurrency(sumTotalValue)}`}
            htmlFor="sumTotalValue"
            className="font-semibold"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="flex flex-column gap-2 p-3 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Contas a Pagar</h1>
          <div
            className="flex justify-end gap-6 w-full"
            style={{ justifyContent: "end" }}
          >
            {(role === "Administrador" || role === "Contas") && (
              <Button
                className="rounded-md px-3 text-sm"
                label="Exportar para Excel"
                severity="danger"
                onClick={onClickExport}
              ></Button>
            )}
          </div>
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
            <Calendar
              id="buttondisplay"
              value={paymentDeadlineFrom}
              onChange={(e) => {
                setPaymentDeadlineFrom(e.value || null);
                onPaymentDeadlineFromSearch(
                  formatDateToYYYYMMDD(e.value || null) || ""
                );
              }}
              locale="pt"
              className="ui-state-default"
              dateFormat="dd/mm/yy"
              showIcon
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Até:"
              htmlFor="paymentDeadlineTo"
              className="font-semibold smaller-text"
            />
            <Calendar
              id="buttondisplay"
              value={paymentDeadlineTo}
              onChange={(e) => {
                setPaymentDeadlineTo(e.value || null);
                onPaymentDeadlineToSearch(
                  formatDateToYYYYMMDD(e.value || null) || ""
                );
              }}
              locale="pt"
              className="ui-state-default"
              dateFormat="dd/mm/yy"
              showIcon
            />
          </div>
          <div className="field flex flex-column gap-1 w-full">
            <LabelTitle
              text="Memo"
              htmlFor="additionalDetails"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onAdditionalDetailsSearch}
              onChange={onChangeAditionalDetails}
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
          header={headerTemplate}
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
            field="costCategory"
            header="Categoria"
            className="smaller-text"
          />
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
            <>
              {(role === "Administrador" || role === "Contas") && (
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
              )}
            </>
          );
        })}
      </div>
    );
  }
}

export default OutstandingInvoicesConstructionList;
