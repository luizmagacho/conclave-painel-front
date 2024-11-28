import { OutstandingInvoices } from "@/services/outstanding-invoices/type";
import { Button } from "primereact/button";
import * as XLSX from "xlsx";

interface ExportExcelProps {
  data: OutstandingInvoices[];
}
const formatCurrency = (value: number | null) => {
  if (value) {
    return value / 100;
  }

  return null;
};
function ExportExcel({ data }: ExportExcelProps) {
  const dataFormatted = data.map((item) => ({
    Obra: item.centerCost,
    Agência: item.bankBranch,
    Local: item.localBank,
    Seviço: item.costCategory,
    "Data de Vencimento": item.paymentDeadlineFormatted,
    Favorecido: item.vendorName,
    Compensado: item.paymentStatus ? "Sim" : "Não",
    Valor: formatCurrency(item.totalAmount),
    Memo: item.additionalDetails,
  }));

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataFormatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "contas_a_pagar.xlsx");
  };

  return (
    <>
      <Button
        className="rounded-md px-3 text-sm"
        label="Exportar para Excel"
        severity="danger"
        onClick={handleExport}
      ></Button>
    </>
  );
}

export default ExportExcel;
