import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { classNames } from "primereact/utils";
import { Tag } from "primereact/tag";
import { useContext, useEffect, useState } from "react";
import {
  OutstandingInvoices,
  OutstandingInvoicesDTO,
} from "@/services/outstanding-invoices/type";
import OutstandingInvoicesDialog from "../OutstandingInvoicesDialog";
import OutstandingInvoicesCreateDialog from "../OutstandingInvoicesCreateDialog";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import OutstandingInvoicesDeleteDialog from "../OutstandingInvoicesDeleteDialog";
import { SupplierContext } from "@/context/SupplierContext";
import { Calendar } from "primereact/calendar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { formatDateToYYYYMMDD, formatarDataBR } from "@/util/date";

import * as XLSX from "xlsx";

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
    outstandingInvoicesVendorExport,
    loading,
    totalElements,
    sumTotalValue,
    handleGetOutstandingInvoices,
    handleGetOutstandingInvoicesToExport,
    handlePostOutstandingInvoices,
    handleUpdateOutstandingInvoices,
    handleDeleteOutstandingInvoices,
    handleGetAllCategories,
    handleSumTotalValueByFilter,
  } = useContext(OutstandingInvoicesContext);

  const { handleGetAllShortenedName } = useContext(SupplierContext);

  const [centerCostSearch, setCenterCostSearch] = useState<string>("");
  const [localBranchSearch, setLocalBranchSearch] = useState<string>("");
  const [vendorNameSearch, setVendorNameSearch] = useState<string>("");
  const [additionalDetailsSearch, setAdditionalDetailsSearch] =
    useState<string>("");
  const [paymentDeadlineFromSearch, setPaymentDeadlineFromSearch] =
    useState<string>("");
  const [paymentDeadlineToSearch, setPaymentDeadlineToSearch] =
    useState<string>("");

  const [paymentDeadlineFrom, setPaymentDeadlineFrom] = useState<Date | null>();
  const [paymentDeadlineTo, setPaymentDeadlineTo] = useState<Date | null>();

  const [first, setFirst] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);



  async function onCreateOutstandingInvoices(
    outstandingInvoices: OutstandingInvoicesDTO
  ) {
    await handlePostOutstandingInvoices(outstandingInvoices);
    handleGetOutstandingInvoices(
      currentPage,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleGetAllCategories();
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
    handleGetOutstandingInvoices(
      currentPage,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    handleGetAllCategories();
  }

  async function onDeleteOutstandingInvoices(outstandingInvoicesId: string) {
    await handleDeleteOutstandingInvoices(outstandingInvoicesId);

    handleGetOutstandingInvoices(
      currentPage,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
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
    handleGetOutstandingInvoices(
      page,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
    setFirst(first);
    setCurrentPage(page);
  }

  const clearedBodyTemplate = (
    outstandingInvoices: OutstandingInvoices
  ) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": outstandingInvoices.paymentStatus,
        })}
      ></i>
    );
  };

  const installmentBadgeTemplate = (invoice: OutstandingInvoices) => {
    if (!invoice.installmentNumber || !invoice.totalInstallments) return null;
    return (
      <Tag
        value={`${invoice.installmentNumber}/${invoice.totalInstallments}`}
        severity="danger"
        style={{ fontSize: "0.72rem", padding: "2px 7px", whiteSpace: "nowrap" }}
      />
    );
  };

  function onCenterCostSearch(centerCost: string) {
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCost,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCost,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onChangeCenterCost(centerCost: string) {
    setCenterCostSearch(centerCost);
  }

  function onLocalBranchSearch(localBranch: string) {
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onChangeLocalBranch(localBranch: string) {
    setLocalBranchSearch(localBranch);
  }

  function onVendorNameSearch(vendorName: string) {
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorName,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
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
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );

    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onChangePaymentDeadlineFrom(paymentDeadlineFrom: string) {
    setPaymentDeadlineFromSearch(paymentDeadlineFrom);
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFrom,
      paymentDeadlineToSearch,
      additionalDetailsSearch
    );
  }

  function onPaymentDeadlineToSearch(paymentDeadlineTo: string) {
    setPaymentDeadlineToSearch(paymentDeadlineTo);
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );
  }

  function onChangePaymentDeadlineTo(paymentDeadlineTo: string) {
    setPaymentDeadlineToSearch(paymentDeadlineTo);
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineTo,
      additionalDetailsSearch
    );
  }

  function onAdditionalDetailsSearch(additionalDetails: string) {
    setFirst(0);
    setCurrentPage(0);
    handleGetOutstandingInvoices(
      0,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetails,
      undefined
    );
    handleSumTotalValueByFilter(
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetails
    );
  }

  function onChangeAditionalDetails(additionalDetails: string) {
    setAdditionalDetailsSearch(additionalDetails);
  }

  const priceTotalValueBodyTemplate = (
    outstandingInvoices: OutstandingInvoices
  ) => {
    return formatCurrency(outstandingInvoices.totalAmount);
  };

  useEffect(() => {
    handleGetOutstandingInvoices(
      currentPage,
      centerCostSearch,
      localBranchSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
    handleGetAllShortenedName();
  }, []);


  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  function onClickExport() {
    handleGetOutstandingInvoicesToExport(
      0,
      centerCostSearch,
      vendorNameSearch,
      paymentDeadlineFromSearch,
      paymentDeadlineToSearch,
      additionalDetailsSearch,
      undefined
    );
  }

  useEffect(() => {
    if (outstandingInvoicesVendorExport.length > 0) {
      const sheetData = [];
      let sumTotal = 0;

      // Definir cabeçalho
      const headerRows = [
        [
          "Despesas dos Favorecidos",
          "",
          "",
          "",
          "",
          `Data: ${formatarDataBR(new Date())}`,
        ],
        [
          centerCostSearch
            ? `Obra ${centerCostSearch} - ${outstandingInvoices[0].localBank}`
            : "Todas as obras",
        ],
        [outstandingInvoicesVendorExport[0].periodOfDate],
        [],
      ];

      headerRows.forEach((row) => sheetData.push(row)); // Adiciona o cabeçalho ao conteúdo principal

      // Cabeçalhos das colunas
      sheetData.push([
        "Data",
        "Favorecido",
        "C",
        "Conta",
        "Memo",
        "Montante",
        "Categoria",
      ]);

      // Adiciona os dados
      outstandingInvoicesVendorExport.forEach((favorecido) => {
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
            invoice.costCategory,
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

      // Cria a worksheet e ajusta as colunas
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Configura larguras das colunas
      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 3 },
        { wch: 20 },
        { wch: 50 },
        { wch: 15 },
      ];

      // Configurações de impressão
      worksheet["!pageSetup"] = {
        orientation: "landscape", // Modo paisagem
        fitToWidth: 1, // Ajustar largura à página
        fitToHeight: 0, // Permitir múltiplas páginas na altura
      };

      // Repete as três primeiras linhas como cabeçalho ao imprimir
      worksheet["!rows"] = [{ level: 1 }, { level: 1 }, { level: 1 }];

      // Aplica o autofiltro às colunas do cabeçalho
      worksheet["!autofilter"] = { ref: "A4:F4" };

      // Adiciona o estilo de fonte no cabeçalho
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            "Despesas dos Favorecidos",
            "",
            "",
            "",
            "",
            `Data: ${formatarDataBR(new Date())}`,
          ],
        ],
        { origin: "A1" }
      );

      // Cria o workbook e salva o arquivo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      XLSX.writeFile(workbook, "Relatório.xlsx");
    }
  }, [outstandingInvoicesVendorExport]);

  const headerTemplate = () => {
    return (
      <div className="flex w-full align-items-center">
        <span style={{ fontSize: "0.78rem", color: "#718096" }}>
          {totalElements} {totalElements === 1 ? "registro" : "registros"}
        </span>
        <div
          className="ml-auto"
          style={{
            background: "linear-gradient(135deg, #fff5f5 0%, #fff 100%)",
            border: "1px solid #fed7d7",
            borderRadius: "8px",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="pi pi-wallet" style={{ color: "#e53e3e", fontSize: "0.85rem" }} />
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#c53030" }}>
            Total: {formatCurrency(sumTotalValue)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="flex flex-column gap-2 px-5 py-3 w-full">
        <div className="flex justify-between items-center w-full flex-shrink-0">
          {/* Botão "Adicionar" no canto esquerdo */}
          <h1 className="m-2">Contas a Pagar</h1>

          {/* Botão "Exportar para Excel" no canto direito */}
          <div className="ml-auto gap-5">
            {(role === "Administrador" || role === "Contas") && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="rounded-md px-3 text-sm m-2"
                label="Adicionar"
                severity="danger"
              />
            )}
            <Button
              className="rounded-md px-3 text-sm m-2"
              label="Exportar para Excel"
              severity="danger"
              onClick={onClickExport}
            />
          </div>
        </div>
        <div className="premium-filter-bar grid formgrid p-fluid w-full align-items-end m-0">
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
            <LabelTitle
              text="Obra"
              htmlFor="centerCost"
              className="font-semibold smaller-text"
            />
            <InputSearch
              onSearch={onCenterCostSearch}
              onChange={onChangeCenterCost}
            />
          </div>
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
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
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
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
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
            <LabelTitle
              text="De:"
              htmlFor="paymentDeadlineFrom"
              className="font-semibold smaller-text"
            />
            <IconField iconPosition="left">
              <InputIcon className="pi pi-calendar"> </InputIcon>
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
                placeholder="dd/mm/aaaa"
              />
            </IconField>
          </div>
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
            <LabelTitle
              text="Até:"
              htmlFor="paymentDeadlineTo"
              className="font-semibold smaller-text"
            />
            <IconField iconPosition="left">
              <InputIcon className="pi pi-calendar"> </InputIcon>
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
                placeholder="dd/mm/aaaa"
              />
            </IconField>
          </div>
          <div className="field col-12 md:col-4 lg:col-2 mb-0">
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
          scrollable
          scrollHeight="85vh"
          rows={10}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={totalElements}
          size="small"
          className="smaller-text flex-1"
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
          <Column
            header="Parcela"
            body={installmentBadgeTemplate}
            className="smaller-text"
            style={{ width: "80px", textAlign: "center" }}
          />
          <Column header="Opções" body={optionsBodyTemplate} />
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
            onHideAndList={() => {
              closeUpdateDialog();
              handleGetOutstandingInvoices(
                0,
                centerCostSearch,
                vendorNameSearch,
                paymentDeadlineFromSearch,
                paymentDeadlineToSearch,
                additionalDetailsSearch,
                undefined
              );
            }}
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

  function optionsBodyTemplate(outstandingInvoices: OutstandingInvoices) {
    return (
      <div className="flex gap-2 justify-content-center align-items-center">
        {(role === "Administrador" || role === "Contas") && (
          <>
            <Button
              icon="pi pi-pencil"
              tooltip="Editar"
              tooltipOptions={{ position: "top", className: "text-xs" }}
              size="small"
              text
              style={{ color: "var(--cor-primaria)", padding: "4px 8px", minWidth: "auto" }}
              onClick={() => openDialog(outstandingInvoices)}
            />
            <Button
              icon="pi pi-trash"
              tooltip="Excluir"
              tooltipOptions={{ position: "top", className: "text-xs" }}
              size="small"
              text
              severity="danger"
              style={{ padding: "4px 8px", minWidth: "auto" }}
              onClick={() => openDeleteDialog(outstandingInvoices)}
            />
          </>
        )}
      </div>
    );
  }
}

export default OutstandingInvoicesList;







