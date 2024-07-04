import { PurchaseContext } from "@/context/PurchaseContext";
import { Purchase, PurchaseDTO } from "@/services/purchase/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useState } from "react";
import PurchaseCreateDialog from "../PurchaseCreateDialog";
import PurchaseUpdateDialog from "../PurchaseUpdateDialog";

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
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    purchases,
    loading,
    totalElements,
    handleGetPurchases,
    handlePostPurchase,
    handleUpdatePurchase,
    handleDeletePurchase,
  } = useContext(PurchaseContext);

  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onClick: openDialog,
    },
  ];

  const columnBodyOptions = {
    options: (purchase: Purchase) => optionsBodyTemplate(options, purchase),
  };

  function openDialog(purchase: Purchase) {
    setCurrPurchase(purchase);
    setShowDialog(true);
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

  const priceUnitValuewBodyTemplate = (purchase: Purchase) => {
    return formatCurrency(purchase.unitValue || null);
  };

  const priceTotalValuewBodyTemplate = (purchase: Purchase) => {
    return formatCurrency(purchase.totalValue || null);
  };

  async function onCreatePurchase(purchase: PurchaseDTO) {
    await handlePostPurchase(purchase);
    handleGetPurchases();
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onUpdatePurchase(purchase: Purchase) {
    await handleUpdatePurchase(purchase);
    handleGetPurchases();
  }

  function closeUpdatedDialog() {
    setCurrPurchase(null);
    setShowDialog((showDialog) => !showDialog);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Compras</h1>
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
        >
          <Column field="centerCost" header="Centro de Custo" />
          <Column field="purchaseDateFormatted" header="Data da Compra" />
          <Column field="requestedDateFormatted" header="Data do Pedido" />
          <Column field="material" header="Material" />
          <Column
            field="unitValue"
            body={priceUnitValuewBodyTemplate}
            header="Valor da Unidade"
          />
          <Column field="quantity" header="Quantidade" />

          <Column
            field="totalValue"
            body={priceTotalValuewBodyTemplate}
            header="Valor Total"
          />
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
      </section>
      {showCreateDialog && (
        <PurchaseCreateDialog
          onCreate={onCreatePurchase}
          onHide={closeCreateDialog}
          visible={showCreateDialog}
        />
      )}
      {currPurchase && (
        <PurchaseUpdateDialog
          onUpdate={onUpdatePurchase}
          onHide={closeUpdatedDialog}
          data={currPurchase}
          visible={showDialog}
        />
      )}
    </>
  );

  function optionsBodyTemplate(elements: Options[], purchase: Purchase) {
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
              onClick={() => el.onClick(purchase)}
            />
          );
        })}
      </div>
    );
  }
}

export default PurchaseList;
