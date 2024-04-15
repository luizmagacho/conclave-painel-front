import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { MaterialContext } from "@/context/MaterialContext";
import { OrderContext } from "@/context/OrderContext";
import { Construction } from "@/services/construction/type";
import { Material } from "@/services/material/type";
import { Order, OrderDTO } from "@/services/order/type";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useContext, useEffect, useState } from "react";

function OrderCompleteInfo() {
  const { selectedOrder, handleGetOrderById } = useContext(OrderContext);
  const [updatedOrder, setUpdatedOrder] = useState<Order>({
    id: null,
    construction: {
      id: null,
      code: "",
      bankBranch: "",
      responsible: "",
      cad: false,
      isCad: "",
      client: "",
      openingDate: "",
      closedDate: "",
      local: "",
      service: "",
      userId: 0,
      enabled: false,
      updatedAt: null,
      createdAt: null,
    },
    materials: [],
    orderDate: new Date(),
    userRequest: "",
    userRequestId: "",
    finish: false,
    updatedAt: null,
    createdAt: null,
  });
  const [updatedMaterial, setUpdatedMaterial] = useState<Material>({
    id: 0,
    name: "",
    quantity: "",
    metricUnit: "",
    enabled: false,
  });
  let name;
  let id;
  if (typeof window !== "undefined") {
    name = window.localStorage.getItem("portal.name");
    id = window.localStorage.getItem("portal.id");
  }
  const [listMaterials, setListMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidMetricUnit, setInvalidMetricUnit] = useState<boolean>(false);
  const { constructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(constructions);

  const { allMaterials } = useContext(MaterialContext);
  const [materialsItems, setMaterialsItems] =
    useState<Material[]>(allMaterials);

  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false);

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const hideAddDialog = () => {
    setShowAddMaterial(false);
  };

  const [showDisabled, setShowDisabled] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    setConstructionsItems(constructions);
  }, [constructions]);

  useEffect(() => {
    setMaterialsItems(allMaterials);
  }, [allMaterials]);

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Novo"
          icon="pi pi-plus"
          onClick={() => setShowAddMaterial(true)}
          severity="success"
        />
        <Button
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedMaterials || !selectedMaterials.length}
        />
      </div>
    );
  };

  useEffect(() => {
    const { id } = router.query;
    handleGetOrderById(typeof id === "string" ? id : "");
  }, []);

  useEffect(() => {
    setLoading(true);

    try {
      setUpdatedOrder((prevOrder) => ({
        ...prevOrder,
        construction: selectedOrder?.construction || prevOrder.construction,
        materials: selectedOrder?.materials || prevOrder.materials,
        finish: selectedOrder?.finish || prevOrder.finish,
        orderDate: selectedOrder?.orderDate || prevOrder.orderDate,
        userRequest: selectedOrder?.userRequest || prevOrder.userRequest,
        userRequestId: selectedOrder?.userRequestId || prevOrder.userRequestId,
      }));
      setSelectedConstruction(selectedOrder?.construction);
      setListMaterials(selectedOrder?.materials || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  const constructionSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredConstructions;
      if (!event.query.trim().length) {
        _filteredConstructions = [...constructions];
      } else {
        _filteredConstructions = constructionsItems.filter((construction) => {
          return construction.code.startsWith(event.query);
        });
      }
      setConstructionsItems(_filteredConstructions);
    }, 250);
  };

  const materialSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredMaterials;
      if (!event.query.trim().length) {
        _filteredMaterials = [...allMaterials];
      } else {
        _filteredMaterials = materialsItems.filter((material) => {
          return material.name.startsWith(event.query);
        });
      }
    });
  };

  function validateFieldsMaterial() {
    setInvalidName(!updatedMaterial.name || updatedMaterial.name === "");
    setInvalidQuantity(
      !updatedMaterial.quantity || updatedMaterial.quantity === ""
    );
    setInvalidMetricUnit(
      !updatedMaterial.metricUnit || updatedMaterial.metricUnit === ""
    );
    if (!invalidName && !invalidQuantity && !invalidMetricUnit) {
      const updatedMaterials = [...allMaterials, updatedMaterial];
      setListMaterials([
        ...listMaterials,
        {
          id: updatedMaterial.id,
          name: updatedMaterial.name,
          metricUnit: updatedMaterial.metricUnit,
          quantity: updatedMaterial.quantity,
          enabled: updatedMaterial.enabled,
        },
      ]);
      hideAddDialog();
    }
  }

  // const updateReviewOrder = () => {
  //   setUpdatedOrder((prevOrder) => ({
  //     ...prevOrder,
  //     construction: selectedConstruction,
  //     materials: listMaterials,
  //   }));
  // };

  async function validateFields() {
    // setInvalidConstructionCode(
    //   !newOrder.construction?.code || newOrder.construction?.code === ""
    // );
    // if (!invalidConstructionCode) {
    //   await handlePostOrder(newOrder);
    //   router.push("/pedidos");
    // }
  }

  return (
    <>
      <Card className="m-3">
        <section className="flex flex-column gap-2 p-5 w-full">
          <h1 className="m-0">Visualizar Pedido</h1>
          <div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Código do Centro de Custo"
                htmlFor="constructionCode"
                className="font-semibold"
              />
              <AutoComplete
                type="text"
                field="code"
                value={selectedConstruction}
                suggestions={constructionsItems}
                completeMethod={constructionSearch}
                onChange={(e: AutoCompleteChangeEvent) =>
                  setSelectedConstruction(e.value)
                }
              />
            </div>
            <div className="card flex flex-column md:flex-row gap-2 w-full">
              <div className="field flex flex-column gap-2 w-full">
                <LabelTitle
                  text="Cliente"
                  htmlFor="client"
                  className="font-semibold"
                />
                <InputText
                  type="text"
                  value={selectedConstruction?.client}
                  disabled
                />
              </div>
              <div className="field flex flex-column gap-2 w-full">
                <LabelTitle
                  text="Local"
                  htmlFor="local"
                  className="font-semibold"
                />
                <InputText
                  type="text"
                  value={selectedConstruction?.local}
                  disabled
                />
              </div>
              <div className="field flex flex-column gap-2 w-full">
                <LabelTitle
                  text="Agência"
                  htmlFor="branchBank"
                  className="font-semibold"
                />
                <InputText
                  type="text"
                  value={selectedConstruction?.bankBranch}
                  disabled
                />
              </div>
              <div className="field flex flex-column gap-2 w-full">
                <LabelTitle
                  text="Responsável"
                  htmlFor="responsable"
                  className="font-semibold"
                />
                <InputText
                  type="text"
                  value={selectedConstruction?.responsible}
                  disabled
                />
              </div>
            </div>
            <Card>
              <h3>Cadastrar Materiais</h3>
              <Toolbar className="mb-2" end={rightToolbarTemplate}></Toolbar>
              <DataTable
                emptyMessage="Nenhum material adicionado"
                value={listMaterials}
                rows={10}
                selection={selectedMaterials}
                onSelectionChange={(e) => {
                  if (Array.isArray(e.value)) {
                    setSelectedMaterials(e.value);
                  }
                }}
                dataKey="id"
                paginator
                selectionMode="multiple"
              >
                <Column selectionMode="multiple" exportable={false}></Column>
                <Column
                  field="name"
                  header="Nome"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
                <Column
                  field="quantity"
                  header="Quantidade"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
                <Column
                  field="metricUnit"
                  header="Unidade Métrica"
                  sortable
                  style={{ minWidth: "12rem" }}
                ></Column>
              </DataTable>
            </Card>
          </div>
          <div
            className="flex justify-end gap-6 w-full"
            style={{ justifyContent: "end" }}
          >
            <Button
              className="font-semibold"
              label="Cancelar"
              outlined
              onClick={() => {
                router.push("/pedidos");
              }}
            />
            <Button
              onClick={() => validateFields()}
              className="rounded-md px-3"
              label="Salvar"
              severity="danger"
            />
          </div>
        </section>
      </Card>
      <Dialog
        visible={showAddMaterial}
        header="Adicionar Material"
        modal
        className="p-fluid"
        onHide={hideAddDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div>
          <div className="field flex flex-column gap-2">
            <LabelTitle
              text="Nome"
              htmlFor="name"
              className="font-semibold"
              required={true}
            />
            <AutoComplete
              type="text"
              field="name"
              value={selectedMaterials}
              suggestions={materialsItems}
              completeMethod={materialSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                const selectedMaterial = e.value;
                setSelectedMaterials([...selectedMaterials, selectedMaterial]);
              }}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedMaterial({
                  ...updatedMaterial,
                  name: e.target.value,
                });
              }}
              value={updatedMaterial?.name}
            />
          </div>
          <div className="field gap-10">
            <div className="field flex flex-column gap-2">
              <LabelTitle
                text="Quantidade"
                htmlFor="quantity"
                className="font-semibold"
                required={true}
              />
              <InputText
                type="number"
                onChange={(e) => {
                  setUpdatedMaterial({
                    ...updatedMaterial,
                    quantity: e.target.value,
                  });
                }}
                value={updatedMaterial?.quantity}
              />
            </div>
            <div className="field flex flex-column gap-2">
              <LabelTitle
                text="Unidade Métrica"
                htmlFor="metricUnit"
                className="font-semibold"
                required={true}
              />
              <InputText
                type="text"
                onChange={(e) => {
                  setUpdatedMaterial({
                    ...updatedMaterial,
                    metricUnit: e.target.value,
                  });
                }}
                value={updatedMaterial?.metricUnit}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full"
            label="Cancelar"
            outlined
            onClick={hideAddDialog}
          />
          <Button
            onClick={() => validateFieldsMaterial()}
            className="w-full"
            label="Salvar"
            severity="danger"
          />
        </div>
      </Dialog>
    </>
  );
}

export default OrderCompleteInfo;
