import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { MaterialContext } from "@/context/MaterialContext";
import { OrderContext } from "@/context/OrderContext";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { Material, MaterialDTO } from "@/services/material/type";
import { OrderDTO } from "@/services/order/type";
import { Message } from "@mui/icons-material";
import { Router, useRouter } from "next/router";
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

function OrderCreate() {
  const router = useRouter();
  let name;
  let id;
  if (typeof window !== "undefined") {
    name = window.localStorage.getItem("portal.name");
    id = window.localStorage.getItem("portal.id");
  }
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialDTO[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);
  const [invalidConstructionBranchBank, setInvalidConstructionBranchBank] =
    useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidMetricUnit, setInvalidMetricUnit] = useState<boolean>(false);
  const [selectedConstruction, setSelectedConstruction] =
    useState<ConstructionDTO>();
  const [newOrder, setNewOrder] = useState<OrderDTO>({
    construction: {
      code: "",
      bankBranch: "",
      responsible: "",
      cad: false,
      client: "",
      openingDate: new Date(),
      local: "",
      service: "",
      userId: "",
    },
    materials: [],
    orderDate: new Date(),
    userRequest: name || "",
    userRequestId: id || "",
    finish: false,
  });
  const [newMaterial, setNewMaterial] = useState<MaterialDTO>({
    name: "",
    quantity: "",
    metricUnit: "",
  });
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false);

  const { handlePostOrder } = useContext(OrderContext);

  const { constructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(constructions);

  const { allMaterials } = useContext(MaterialContext);
  const [materialsItems, setMaterialsItems] =
    useState<Material[]>(allMaterials);

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

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

  const hideAddDialog = () => {
    setShowAddMaterial(false);
  };

  function validateFieldsMaterial() {
    setInvalidName(!newMaterial.name || newMaterial.name === "");
    setInvalidQuantity(!newMaterial.quantity || newMaterial.quantity === "");
    setInvalidMetricUnit(
      !newMaterial.metricUnit || newMaterial.metricUnit === ""
    );
    if (!invalidName && !invalidQuantity && !invalidMetricUnit) {
      const updatedMaterials = [...allMaterials, newMaterial];
      setSelectedMaterials(updatedMaterials);
      hideAddDialog();
    }
  }

  const updateNewOrder = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      construction: selectedConstruction,
      materials: selectedMaterials,
    }));
  };

  useEffect(() => {
    updateNewOrder();
  }, [selectedConstruction, selectedMaterials]);

  async function validateFields() {
    setInvalidConstructionCode(
      !newOrder.construction?.code || newOrder.construction?.code === ""
    );
    if (!invalidConstructionCode) {
      await handlePostOrder(newOrder);
      router.push("/pedidos");
    }
  }

  return (
    <>
      <Card className="m-3">
        <section className="flex flex-column gap-4 p-5 w-full">
          <h1 className="m-0">Cadastrar Pedido</h1>
          <div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Código da Obra"
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
            <div className="card flex flex-column md:flex-row gap-3 w-full">
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
              <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
              <DataTable
                emptyMessage="Nenhum material adicionado"
                value={selectedMaterials}
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
                setNewMaterial({ ...newMaterial, name: e.target.value });
                setInvalidName(false);
              }}
              value={newMaterial?.name}
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
                  setNewMaterial({ ...newMaterial, quantity: e.target.value });
                  setInvalidQuantity(false);
                }}
                value={newMaterial?.quantity}
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
                  setNewMaterial({
                    ...newMaterial,
                    metricUnit: e.target.value,
                  });
                  setInvalidMetricUnit(false);
                }}
                value={newMaterial?.metricUnit}
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

export default OrderCreate;
