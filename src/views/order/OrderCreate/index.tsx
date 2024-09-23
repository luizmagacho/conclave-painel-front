import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { MaterialContext } from "@/context/MaterialContext";
import { OrderContext } from "@/context/OrderContext";
import { Construction } from "@/services/construction/type";
import { updateMaterial } from "@/services/material";
import {
  Material,
  MaterialDTO,
  MaterialOrderDTO,
} from "@/services/material/type";
import { OrderDTO } from "@/services/order/type";
import { formatDateToHHMM, formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useRef, useState } from "react";

function OrderCreate() {
  const router = useRouter();
  let name;
  let id;
  if (typeof window !== "undefined") {
    name = window.localStorage.getItem("portal.name");
    id = window.localStorage.getItem("portal.id");
  }
  const dt = useRef<DataTable<MaterialDTO[]>>(null);

  const [listMaterials, setListMaterials] = useState<MaterialOrderDTO[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<
    MaterialOrderDTO[]
  >([]);
  const [showAddMaterial, setShowAddMaterial] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);
  const [invalidListMaterials, setInvalidListMaterials] =
    useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidUnit, setInvalidUnit] = useState<boolean>(false);
  const [invalidDate, setInvalidDate] = useState<boolean>(false);
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [newOrder, setNewOrder] = useState<OrderDTO>({
    centerCost: "",
    centerCostId: "",
    bankBranchLocalBank: "",
    payer: "",
    typeCenterCost: "",
    materials: [],
    orderDate: "",
    orderTime: "",
    userRequest: "",
    userRequestId: id || "",
    finish: false,
  });
  const [newMaterial, setNewMaterial] = useState<MaterialOrderDTO>({
    name: "",
    quantity: null,
    unit: "",
  });
  const [newOrderDate, setNewOrderDate] = useState<Date | null>(null);
  const [newOrderTime, setNewOrderTime] = useState<Date | null>(null);

  const toast = useRef<Toast>(null);

  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const [deleteMaterialsDialog, setDeleteMaterialsDialog] =
    useState<boolean>(false);

  const { handlePostOrder } = useContext(OrderContext);

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

  const { allMaterials, handleGetAllMaterials } = useContext(MaterialContext);
  const [materialsItems, setMaterialsItems] =
    useState<Material[]>(allMaterials);

  const confirmDeleteSelected = () => {
    setDeleteMaterialsDialog(true);
  };

  useEffect(() => {
    setMaterialsItems(allMaterials);
  }, [allMaterials]);

  useEffect(() => {
    handleGetAllMaterials();
  }, []);

  const hideDeleteMaterialsDialog = () => {
    setDeleteMaterialsDialog(false);
  };

  const deletedSelectedMaterials = () => {
    let _materials = listMaterials.filter(
      (material) => !selectedMaterials.includes(material)
    );
    setListMaterials(_materials);
    setDeleteMaterialsDialog(false);
    setSelectedMaterials([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Materials Deleted",
      life: 3000,
    });
  };

  const hideAddDialog = () => {
    setShowAddMaterial(false);
  };

  useEffect(() => {
    setMaterialsItems(allMaterials);
  }, [allMaterials]);

  useEffect(() => {
    handleGetAllMaterials();
  }, []);

  useEffect(() => {
    setConstructionsItems(allConstructions);
  }, [allConstructions]);

  useEffect(() => {
    setMaterialsItems(allMaterials);
  }, [allMaterials]);

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Novo"
          icon="pi pi-plus"
          onClick={() => {
            if (!materialsItems) alert("Cadastre materiais");
            setShowAddMaterial(true);
          }}
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
        _filteredConstructions = [...allConstructions];
      } else {
        _filteredConstructions = constructionsItems.filter((construction) => {
          return construction.code.startsWith(event.query);
        });
      }
      setConstructionsItems(_filteredConstructions);
    }, 150);
  };

  const materialSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredMaterials;
      if (!event.query.trim().length) {
        _filteredMaterials = [...allMaterials];
      } else {
        _filteredMaterials = materialsItems.filter((material) => {
          return material.name
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setMaterialsItems(_filteredMaterials);
      if (_filteredMaterials.length === 0) setMaterialsItems(allMaterials);
    }, 150);
  };

  function validateFieldsMaterial() {
    setInvalidName(!newMaterial.name || newMaterial.name === "");
    setInvalidQuantity(!newQuantity);

    if (!invalidName && !invalidQuantity) {
      setNewMaterial({ ...newMaterial, name: newMaterial.name });
      setListMaterials([
        ...listMaterials,
        {
          name: newMaterial.name,
          unit: newMaterial.unit,
          quantity: newQuantity,
        },
      ]);
      hideAddDialog();
      setNewMaterial({
        name: "",
        quantity: null,
        unit: "",
      });
      setNewQuantity(null);
    }
  }

  async function validateFields() {
    setInvalidConstructionCode(
      !newOrder.centerCost || newOrder.centerCost === ""
    );
    setInvalidListMaterials(!listMaterials || listMaterials.length === 0);
    if (!invalidConstructionCode && !invalidListMaterials) {
      await handlePostOrder(newOrder);
      router.push("/pedidos");
    }
  }

  const updateNewOrder = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      construction: selectedConstruction,
      materials: listMaterials,
    }));
  };

  useEffect(() => {
    updateNewOrder();
  }, [selectedConstruction, listMaterials]);

  useEffect(() => {
    setNewOrder((prevCost) => ({
      ...prevCost,
      centerCostId: selectedConstruction?.id || "",
      centerCost: selectedConstruction?.code || "",
      bankBranchLocalBank: selectedConstruction?.bankBranch
        ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
        : "" || "",

      typeCenterCost: selectedConstruction?.service || "",
      payer: selectedConstruction?.client || "",
    }));
  }, [selectedConstruction]);

  useEffect(() => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      orderDate: formatDateToYYYYMMDD(newOrderDate) || prevOrder.orderDate,
      orderTime: formatDateToHHMM(newOrderTime) || prevOrder.orderTime,
    }));
  }, [newOrderDate, newOrderTime]);

  const deleteMaterialsDialogFooter = (
    <React.Fragment>
      <Button
        label="Não"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteMaterialsDialog}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        severity="danger"
        onClick={deletedSelectedMaterials}
      />
    </React.Fragment>
  );

  return (
    <>
      <Card className="m-3">
        <section className="flex flex-column gap-2 w-full">
          <h1 className="m-0">Cadastrar Pedido</h1>

          <div className="card flex flex-column md:flex-row gap-2 w-full">
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Código da Obra"
                htmlFor="constructionCode"
                className="font-semibold"
              />
              <div className="card p-fluid">
                <AutoComplete
                  type="text"
                  field="code"
                  dropdown
                  value={selectedConstruction}
                  suggestions={constructionsItems}
                  completeMethod={constructionSearch}
                  onChange={(e: AutoCompleteChangeEvent) => {
                    setSelectedConstruction(e.value);
                    setInvalidConstructionCode(false);
                  }}
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  forceSelection
                />
                {invalidConstructionCode && (
                  <Message
                    severity="error"
                    text="Obra é obrigatório"
                    className="smaller-text"
                  />
                )}
              </div>
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Nome da Obra"
                htmlFor="bankBranchLocalBank"
                className="font-semibold"
              />
              <InputText
                type="text"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newOrder?.bankBranchLocalBank}
                disabled
              />
            </div>
          </div>
          <div className="card flex flex-column md:flex-row gap-2 w-full">
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Data"
                htmlFor="orderDate"
                className="font-semibold"
              />
              <Calendar
                id="buttondisplay"
                onChange={(e) => {
                  setNewOrderDate(e.value || null);
                  setInvalidDate(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newOrderDate}
                locale="pt"
                className="ui-state-default"
                dateFormat="dd/mm/yy"
                showIcon
              />
              {invalidDate && (
                <Message
                  severity="error"
                  text="Data do Pedido é obrigatório"
                  className="smaller-text"
                />
              )}
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Hora"
                htmlFor="requestTime"
                className="font-semibold"
              />
              <Calendar
                id="buttondisplay"
                onChange={(e) => {
                  setNewOrderTime(e.value || null);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newOrderTime}
                className="ui-state-default"
                icon={() => <i className="pi pi-clock" />}
                timeOnly
                showIcon
              />
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Solicitante"
                htmlFor="userRequest"
                className="font-semibold"
              />
              <InputText
                type="text"
                value={newOrder?.userRequest}
                style={{ height: "30px", fontSize: "0.8rem" }}
                onChange={(e) => {
                  setNewOrder({ ...newOrder, userRequest: e.target.value });
                }}
              />
            </div>
          </div>

          <Card>
            <h3>Cadastrar Materiais</h3>
            <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
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
                field="unit"
                header="Unidade"
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
            </DataTable>
            {invalidListMaterials && (
              <Message
                severity="error"
                text="Pelo menos um material é obrigatório"
                className="smaller-text"
              />
            )}
          </Card>

          <div
            className="flex justify-end gap-2 w-full"
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
              value={newMaterial}
              suggestions={materialsItems}
              completeMethod={materialSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setNewMaterial(e.value);
              }}
              dropdown
              forceSelection
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
          </div>
          <div className="field gap-2">
            <div className="field flex flex-column gap-2">
              <LabelTitle
                text="Quantidade"
                htmlFor="quantity"
                className="font-semibold"
                required={true}
              />
              <InputNumber
                onChange={(e) => {
                  if (e.value) {
                    setNewQuantity(e.value);
                  }
                  setInvalidQuantity(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newQuantity}
              />
            </div>
            <div className="field flex flex-column gap-2">
              <LabelTitle
                text="Unidade"
                htmlFor="unit"
                className="font-semibold"
                required={true}
              />
              <InputText
                type="text"
                onChange={(e) => {
                  setNewMaterial({
                    ...newMaterial,
                    unit: e.target.value,
                  });
                  setInvalidUnit(false);
                }}
                value={newMaterial?.unit}
                disabled
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
      <Dialog
        visible={deleteMaterialsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmação"
        modal
        footer={deleteMaterialsDialogFooter}
        onHide={hideDeleteMaterialsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedMaterials && (
            <span>
              Tem certeza que dejeja excluir os materiais selecionados?
            </span>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default OrderCreate;
