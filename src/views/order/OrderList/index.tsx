import InputSearch from "@/components/InputSearch";
import { OrderContext } from "@/context/OrderContext";
import { Order } from "@/services/order/type";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { TabPanel, TabView } from "primereact/tabview";
import { useContext, useState } from "react";
import * as XLSX from "xlsx";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (order: Order) => void;
}

interface OptionType {
  type: string;
}

const columns = [
  {
    field: "orderDateFormatted",
    header: "Data do Pedido",
  },
  {
    field: "construction.bankBranch",
    header: "Código Agência",
  },
  {
    field: "construction.local",
    header: "Local Agência",
  },
  {
    field: "userRequest",
    header: "Solicitante",
  },
];

function OrderList() {
  const router = useRouter();
  const [currOrder, setCurrOrder] = useState<Order | null>(null);
  const [currOrderFinish, setCurrOrderFinish] = useState<Order | null>(null);
  const [orderDateSearch, setOrderDateSearch] = useState<Date | null>(null);
  const [constructionBankBranchSearch, setConstructionBankBranchSeatch] =
    useState<string>("");
  const [showDialogFinish, setShowDialogFinish] = useState<boolean>(false);
  const [constructionCodeSearch, setConstructionCodeSearch] =
    useState<string>("");

  const {
    ordersNotFinished,
    ordersFinished,
    loading,
    totalElementsNotFinished,
    totalElementsFinished,
    handleGetOrdersNotFinished,
    handleGetOrdersFinished,
  } = useContext(OrderContext);

  const [firstNotFinished, setFirstNotFinished] = useState<number>(0);
  const [firstFinished, setFirstFinished] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Visualizar",
      label: "Visualizar",
      onClick: openDialog,
    },
    {
      ariaLabel: "Fechar Pedido",
      label: "Fechar Pedido",
      onClick: finishOrderDialog,
    },
  ];

  const columnBodyOptions = {
    options: (orders: Order) => optionsBodyTemplate(options, orders),
  };

  function openDialog(order: Order) {
    setCurrOrder(order);
    router.push(`/pedidos/${order.id}`);
  }

  function finishOrderDialog(order: Order) {
    setCurrOrderFinish(order);
    setShowDialogFinish((showDialogFinish) => !showDialogFinish);
  }

  function onPageChangeNotFinished(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetOrdersNotFinished(page);
    setFirstNotFinished(first);
  }

  function onPageChangeFinished(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetOrdersFinished(page);
    setFirstFinished(first);
  }

  function onSearch(name: string) {
    handleGetOrdersFinished(
      0,
      constructionBankBranchSearch,
      orderDateSearch,
      true
    );
  }

  function onChangeSearch(constructionCode: string) {
    setConstructionCodeSearch(constructionCode);
  }

  function onClickExport() {
    const sheetData: (string | number)[][] = [];

    ordersNotFinished.forEach((order) => {
      sheetData.push([
        "Código da Obra",
        "Nome da Obra",
        "Data",
        "Hora",
        "Solicitante",
      ]);
      sheetData.push([
        order.centerCost,
        order.bankBranchLocalBank,
        order.orderDateFormatted,
        order.orderTime,
        order.userRequest,
      ]);

      sheetData.push(["", "Materiais"]);
      sheetData.push(["", "", "Nome", "Quantidade", "Unidade"]);

      order.materials.forEach((material) => {
        sheetData.push([
          "",
          "",
          material.name,
          material.quantity || 0,
          material.unit,
        ]);
      });
    });

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "Pedidos.xlsx");
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Pedidos</h1>
          <InputSearch onSearch={onSearch} onChange={onChangeSearch} />
          <Button
            style={{
              backgroundColor: "var(--cor-primaria)",
              border: "1px solid var(--cor-primaria)",
            }}
            onClick={() => {
              router.push("pedidos/cadastrar");
            }}
          >
            Adicionar
          </Button>
        </div>
        <div
          className="flex justify-end gap-6 w-full"
          style={{ justifyContent: "end" }}
        >
          <Button
            className="rounded-md px-3 text-sm"
            label="Exportar para Excel"
            severity="danger"
            onClick={onClickExport}
          ></Button>
        </div>
        <TabView>
          <TabPanel header="Abertos">
            <DataTable
              emptyMessage="Nenhum pedido encontrado"
              value={ordersNotFinished}
              loading={loading}
              stripedRows
              showGridlines
              globalFilterFields={[
                "orderDate",
                "construction.bankBranch",
                "construction.local",
              ]}
              rows={15}
              totalRecords={totalElementsNotFinished}
              tableStyle={{ minWidth: "50rem" }}
              size="small"
              className="smaller-text"
            >
              <Column
                field="orderDateFormatted"
                header="Data Abertura"
                filter
                filterPlaceholder="Buscar por Data"
                className="smaller-text"
              />
              <Column field="orderTime" header="Hora" filter />
              <Column field="centerCost" header="Obra" />

              <Column field="bankBranchLocalBank" header="Agência" />
              <Column
                field="userRequest"
                header="Solicitante"
                filter
                filterPlaceholder="Buscar por Solicitante"
                className="smaller-text"
              />
              <Column
                header="Opções"
                body={columnBodyOptions.options}
                className="smaller-text"
              />
            </DataTable>
            <Paginator
              first={firstNotFinished}
              rows={10}
              totalRecords={totalElementsNotFinished}
              onPageChange={onPageChangeNotFinished}
            />
          </TabPanel>
          <TabPanel header="Finalizados">
            <DataTable
              emptyMessage="Nenhum pedido encontrado"
              value={ordersFinished}
              loading={loading}
              stripedRows
              showGridlines
              globalFilterFields={["orderDate", "bankBranchLocalBank"]}
              rows={10}
              totalRecords={totalElementsFinished}
              tableStyle={{ minWidth: "50rem" }}
              size="small"
              className="smaller-text"
            >
              <Column
                field="orderDateFormatted"
                header="Data"
                filter
                filterPlaceholder="Buscar por Data"
              />
              <Column field="orderTime" header="Hora" filter />
              <Column field="bankBranchLocalBank" header="Agência" />
              <Column
                field="userRequest"
                header="Solicitante"
                filter
                filterPlaceholder="Buscar por Solicitante"
              />
              <Column header="Opções" body={columnBodyOptions.options} />
            </DataTable>
            <Paginator
              first={firstFinished}
              rows={10}
              totalRecords={totalElementsFinished}
              onPageChange={onPageChangeNotFinished}
            />
          </TabPanel>
        </TabView>
      </section>
    </>
  );
}

function optionsBodyTemplate(elements: Options[], orders: Order) {
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
            onClick={() => el.onClick(orders)}
          />
        );
      })}
    </div>
  );
}

export default OrderList;
