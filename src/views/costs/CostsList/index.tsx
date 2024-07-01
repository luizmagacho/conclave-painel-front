import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { CostContext } from "@/context/CostContext";
import { Cost, CostDTO } from "@/services/costs/type";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useContext, useEffect, useState } from "react";
import CostCreateDialog from "../CostCreateDialog";
import CostUpdateDialog from "../CostUpdateDialog";
import Cookies from "js-cookie";
import { classNames } from "primereact/utils";

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

function CostList() {
  const role = Cookies.get("portal.role");
  const router = useRouter();
  const [currCost, setCurrCost] = useState<Cost | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const {
    costs,
    loading,
    totalElements,
    handleGetCostsByCenterCostId,
    handlePostCost,
    handleUpdateCost,
  } = useContext(CostContext);

  const { selectedConstruction, handleGetConstructionById } =
    useContext(ConstructionContext);

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
    const { id } = router.query;
    handleGetCostsByCenterCostId(typeof id === "string" ? id : "", page);
    setFirst(first);
  }

  async function onCreateCost(cost: CostDTO) {
    await handlePostCost(cost);
    const { id } = router.query;
    handleGetCostsByCenterCostId(typeof id === "string" ? id : "");
    handleGetConstructionById(typeof id === "string" ? id : "");
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onUpateCost(cost: Cost) {
    await handleUpdateCost(cost);
    const { id } = router.query;
    handleGetCostsByCenterCostId(typeof id === "string" ? id : "");
    handleGetConstructionById(typeof id === "string" ? id : "");
  }

  function closeUpdateDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrCost(null);
  }

  useEffect(() => {
    const { id } = router.query;
    console.log(id);
    handleGetConstructionById(typeof id === "string" ? id : "");
    handleGetCostsByCenterCostId(typeof id === "string" ? id : "");
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
      <div className="flex gap-2 w-full">
        <div className="flex-grow-1">
          <LabelTitle
            text={`Total Bruto Faturado: ${formatCurrency(
              selectedConstruction?.totalBilled || null
            )}`}
            htmlFor="todayBalance"
            className="font-semibold smaller-text"
          />
        </div>
        <div className="flex-shrink-0">
          <LabelTitle
            text={`Total Remas: ${formatCurrency(
              selectedConstruction?.totalRemas || null
            )}`}
            htmlFor="finalBalance"
            className="font-semibold smaller-text"
          />
        </div>
      </div>
    );
  };

  const priceWithdrawBodyTemplate = (cost: Cost) => {
    return formatCurrency(cost.value || null);
  };

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

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Custos</h1>
        </div>
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="flex flex-column gap-1 w-full">
            <LabelTitle
              text={`Centro de Custo: ${selectedConstruction?.code}`}
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
          value={costs}
          loading={loading}
          stripedRows
          showGridlines
          rows={15}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={totalElements}
          size="small"
          footer={footerTemplate}
        >
          <Column field="purchaseDateFormatted" header="Data do Custo" />
          <Column field="vendorName" header="Favorecido" />
          <Column
            field="value"
            header="Valor"
            body={priceWithdrawBodyTemplate}
          />
          <Column
            field="paymentDeadlineFormatted"
            header="Data de Vencimento"
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
          <Button
            onClick={() => {
              setShowCreateDialog(true);
            }}
            className="rounded-md px-3 text-sm"
            label="Adicionar"
            severity="danger"
          />
        </div>
        {showCreateDialog && (
          <CostCreateDialog
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

export default CostList;
