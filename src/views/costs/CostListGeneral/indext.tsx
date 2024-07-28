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
import CostUpdateDialog from "../CostUpdateDialog";
import InputSearch from "@/components/InputSearch";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { getMonthsNames } from "@/util/date";
import CostCreateGenericDialog from "../CostCreateGenericDialog";

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

function CostListGeneral() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currCost, setCurrCost] = useState<Cost | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const {
    costs,
    costTotal,
    loading,
    totalElements,
    handleGetCosts,
    handleGetCostTotal,
    handlePostCost,
    handleUpdateCost,
  } = useContext(CostContext);

  const [centerCostSearch, setCenterCostSearch] = useState<string>("");
  const [monthSearch, setMonthSearch] = useState<string>("");

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

  function openDialog(cost: Cost) {
    setCurrCost(cost);
    setShowDialog(true);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetCosts();
    setFirst(first);
  }

  async function onCreateCost(cost: CostDTO) {
    await handlePostCost(cost);
    handleGetCosts();
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onUpateCost(cost: Cost) {
    await handleUpdateCost(cost);
    handleGetCosts();
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrCost(null);
  }

  useEffect(() => {
    handleGetCosts();
    handleGetCostTotal();
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

  const footerTemplate = () => {
    return (
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <LabelTitle
          text={`Total Mão de Obra: ${formatCurrency(
            costTotal?.totalWorkersValue || null
          )}`}
          htmlFor="todayBalance"
          className="font-semibold smaller-text"
        />
        <LabelTitle
          text={`Total Material: ${formatCurrency(
            costTotal?.totalMaterialValue || null
          )}`}
          htmlFor="finalBalance"
          className="font-semibold smaller-text"
        />
        <LabelTitle
          text={`Total INSS: ${formatCurrency(
            costTotal?.totalInssValue || null
          )}`}
          htmlFor="finalBalance"
          className="font-semibold smaller-text"
        />
        <LabelTitle
          text={`Total: ${formatCurrency(costTotal?.totalValue || null)}`}
          htmlFor="finalBalance"
          className="font-semibold smaller-text"
        />
      </div>
    );
  };

  const priceWorkerValueBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.workerValue || null);
  };

  const priceInssValueBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.inssValue || null);
  };

  const priceMaterialValueBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.materialValue || null);
  };

  const priceTotalValueBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.totalAmount || null);
  };

  function onCenterCostSearch(centerCost: string) {
    handleGetCosts(0, centerCost, monthSearch);
    handleGetCostTotal(centerCost, monthSearch);
  }

  function onChangeCenterCost(centerCost: string) {
    setCenterCostSearch(centerCost);
  }

  function onMonthSearch(month: string) {
    handleGetCosts(0, centerCostSearch, month);
    handleGetCostTotal(centerCostSearch, month);
  }

  function onChageMonth(month: string) {
    setMonthSearch(month);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Custos</h1>
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
              text="Mês"
              htmlFor="month"
              className="font-semibold smaller-text"
            />
            <Dropdown
              options={getMonthsNames()}
              value={monthSearch}
              onChange={(e: DropdownChangeEvent) => {
                setMonthSearch(e.value);
                onMonthSearch(e.value);
              }}
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
          footer={footerTemplate}
        >
          <Column
            field="centerCost"
            header="Centro de Custo"
            className="smaller-text"
          />
          <Column
            field="bankBranchLocalBank"
            header="Agência"
            className="smaller-text"
          />
          <Column
            field="typeCenterCost"
            header="Tipo de Obra"
            className="smaller-text"
          />
          <Column
            field="issueDateFormatted"
            header="Data da Emissão"
            className="smaller-text"
          />
          <Column
            field="receiptDateFormatted"
            header="Data do Recebimento"
            className="smaller-text"
          />
          <Column field="payer" header="Tomador" className="smaller-text" />
          <Column
            field="totalAmount"
            header="Valor Total"
            body={priceTotalValueBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="workerValue"
            header="Valor Mão de Obra"
            body={priceWorkerValueBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="materialValue"
            header="Valor Material"
            body={priceMaterialValueBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="inssValue"
            header="INSS"
            body={priceInssValueBodyTemplate}
            className="smaller-text"
          />
          <Column
            field="invoice"
            header="Nota Fiscal"
            className="smaller-text"
          />
          <Column
            field="numContract"
            header="Contrato"
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
        {showCreateDialog && (
          <CostCreateGenericDialog
            visible={showCreateDialog}
            onHide={closeCreateDialog}
            onCreate={onCreateCost}
          />
        )}
        {currCost && (
          <CostUpdateDialog
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

export default CostListGeneral;
