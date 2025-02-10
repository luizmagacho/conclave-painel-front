import { PurchaseContext } from "@/context/PurchaseContext";
import { Purchase, PurchaseDTO } from "@/services/purchase/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useState } from "react";
import PurchaseDeleteDialog from "../PurchaseDeleteDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (purchase: Purchase) => void;
}

interface OptionType {
  type: String;
}

function PurchaseList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currPurchase, setCurrPurchase] = useState<Purchase | null>(null);
  const [currDeletePurchase, setCurrDeletePurchase] = useState<Purchase | null>(
    null
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    purchases,
    supplierPurchaseListToExport,
    loading,
    totalElements,
    handleGetPurchases,
    handleGetPurchaseById,
    handleUpdatePurchase,
    handleDeletePurchase,
    handleGetSupplierPurchaseToExport,
  } = useContext(PurchaseContext);

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
    {
      ariaLabel: "Exportar",
      label: "Exportar",
      onClick: onClickExport,
    },
  ];

  const columnBodyOptions = {
    options: (purchase: Purchase) => optionsBodyTemplate(options, purchase),
  };

  async function openDialog(purchase: Purchase) {
    await handleGetPurchaseById(purchase.id);
    router.push(`/compras/${purchase.id}`);
  }

  function openDeleteDialog(purchase: Purchase) {
    setCurrDeletePurchase(purchase);
    setShowDeleteDialog(true);
  }

  const formatCurrency = (value: number | null) => {
    if (!value) {
      return "-";
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  async function onDeletePurchase(purchaseId: string) {
    await handleDeletePurchase(purchaseId);
    handleGetPurchases();
  }
  function closeDeleteDialog() {
    setCurrDeletePurchase(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }
  async function onUpdatePurchase(purchase: Purchase) {
    await handleUpdatePurchase(purchase);
    handleGetPurchases();
  }

  function closeUpdatedDialog() {
    setCurrPurchase(null);
    setShowDialog((showDialog) => !showDialog);
  }

  async function onClickExport(purchase: Purchase) {
    await handleGetSupplierPurchaseToExport(purchase.id);
    const sheetData: (string | number)[][] = [];
    sheetData.push(["MAPA DE PEDIDO/COTAÇÃO DE MATERIAL"]);
    sheetData.push([
      `Data: ${purchase.requestedDateFormatted}`,
      "",
      "",
      `Hora: ${purchase.requestedTimeFormatted}`,
      `Obra N°: ${purchase.centerCost}`,
      "Fornecedor 1",
      "",
      "Fornecedor 2",
      "",
      "Fornecedor 3",
      "",
    ]);

    sheetData.push([
      `Cliente: ${purchase.centerCost}`,
      "",
      "",
      "",
      "",
      supplierPurchaseListToExport[0].name,
      "",
      supplierPurchaseListToExport[1].name,
      "",
      supplierPurchaseListToExport[2].name,
      "",
    ]);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Compras</h1>
          {(role === "Administrador" || role === "Compras") && (
            <Button
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
              }}
              onClick={() => {
                router.push("compras/cadastrar");
              }}
            >
              Adicionar
            </Button>
          )}
        </div>
        <DataTable
          emptyMessage="Nenhum custo encontrado."
          value={purchases}
          loading={loading}
          stripedRows
          showGridlines
          rows={15}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={totalElements}
          size="small"
          className="smaller-text"
        >
          <Column field="centerCost" header="Obra" />
          <Column field="requestedDateFormatted" header="Data" />
          <Column field="requestedTimeFormatted" header="Hora" />
          <Column field="material" header="Material" />
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
      </section>
      {currDeletePurchase && (
        <PurchaseDeleteDialog
          onDelete={onDeletePurchase}
          onHide={closeDeleteDialog}
          data={currDeletePurchase}
          visible={showDeleteDialog}
        />
      )}
    </>
  );

  function optionsBodyTemplate(elements: Options[], purchase: Purchase) {
    return (
      <div className="flex gap-2">
        {elements.map((el, index) => {
          return (
            <>
              {(role === "Administrador" || role === "Compras") && (
                <Button
                  key={index}
                  icon={el.icon}
                  label={el.label}
                  aria-label={el.ariaLabel}
                  tooltip={el.tooltip}
                  tooltipOptions={{ position: "top", className: "text-xs" }}
                  size="small"
                  severity="danger"
                  onClick={() => el.onClick(purchase)}
                />
              )}
            </>
          );
        })}
      </div>
    );
  }
}

export default PurchaseList;
