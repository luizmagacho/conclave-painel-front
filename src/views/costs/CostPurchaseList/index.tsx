import InputSearch from "@/components/InputSearch";
import LabelTitle from "@/components/LabelTitle";
import { CostContext } from "@/context/CostContext";
import { Cost, CostDTO } from "@/services/costs/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { classNames } from "primereact/utils";
import { useContext, useEffect, useState } from "react";
import CostPurchaseCreateDialog from "../CostPurchaseCreateDialog";
import CostPurchaseDialog from "../CostPurchaseDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (costs: Cost) => void;
}

interface OptionType {
  type: string;
}

function CostPurchaseList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currCost, setCurrCost] = useState<Cost | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const {
    costs,
    loading,
    totalElements,
    handleGetCosts,
    handleGetCostTotal,
    handlePostCost,
    handleUpdateCost,
  } = useContext(CostContext);

  const [centerCostSearch, setCenterCostSearch] = useState<string>("");

  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onClick: openDialog,
    },
  ];

  const columnBodyOptions = {
    options: (cost: Cost) => optionsBodyTemplate(options, cost),
  };

  async function onCreateCost(cost: CostDTO) {
    await handlePostCost(cost);
    handleGetCosts();
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function openDialog(cost: Cost) {
    setCurrCost(cost);
    setShowDialog(true);
  }

  async function onUpateCost(cost: Cost) {
    await handleUpdateCost(cost);
    handleGetCosts();
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrCost(null);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetCosts();
    setFirst(first);
  }

  const clearedBodyTemplate = (cost: Cost) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": cost.paymentStatus,
          "false-icon pi-times-circle": !cost.paymentStatus,
        })}
      ></i>
    );
  };

  function onCenterCostSearch(centerCost: string) {
    handleGetCosts(0, centerCost);
    handleGetCostTotal(centerCost);
  }

  function onChangeCenterCost(centerCost: string) {
    setCenterCostSearch(centerCost);
  }

  const priceTotalValueBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.totalAmount || null);
  };

  useEffect(() => {
    handleGetCosts();
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
          <h1 className="m-0">Custos - Contas a Pagar</h1>
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
        </div>
        <DataTable
          emptyMessage="Nenhum custo encontrado."
          value={costs}
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
          <CostPurchaseCreateDialog
            visible={showCreateDialog}
            onHide={closeCreateDialog}
            onCreate={onCreateCost}
          />
        )}
        {currCost && (
          <CostPurchaseDialog
            visible={showDialog}
            onHide={closeUpdateDialog}
            onUpdate={onUpateCost}
            data={currCost}
          />
        )}
      </section>
    </>
  );

  function optionsBodyTemplate(elements: Options[], cost: Cost) {
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
              onClick={() => el.onClick(cost)}
            />
          );
        })}
      </div>
    );
  }
}

export default CostPurchaseList;
