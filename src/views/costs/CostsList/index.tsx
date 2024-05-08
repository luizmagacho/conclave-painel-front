import { CostContext } from "@/context/CostContext";
import { Cost } from "@/services/costs/type";
import { useRouter } from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useContext, useState } from "react";

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
  const router = useRouter();
  const [currCost, setCurrCost] = useState<Cost | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const {
    costs,
    loading,
    totalElements,
    handleGetCostsByCenterCostId,
    handlePostCost,
  } = useContext(CostContext);

  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onClick: openDialog,
    },
  ];

  function openDialog(cost: Cost) {
    setCurrCost(cost);
    setShowDialog(true);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    const { id } = router.query;
    handleGetCostsByCenterCostId(typeof id === "number" ? id : 0, page);
    setFirst(first);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Custos</h1>
        </div>
        <DataTable
          emptyMessage="Nenhuma custo encontrado."
          stripedRows
          showGridlines
          rows={10}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
        >
          <Column field="costCenter" header="Centro de Custo" />
          <Column field="bankBranch" header="Código Agência" />
          <Column field="localBank" header="Local Agência" />
          <Column field="purchaseDate" header="Data" />
          <Column field="name" header="Nome" />
          <Column field="value" header="Valor" />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}
