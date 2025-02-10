import LabelTitle from "@/components/LabelTitle";
import MaterialAccordion from "@/components/MaterialAccordion";
import { ConstructionContext } from "@/context/ConstructionContext";
import { MaterialContext } from "@/context/MaterialContext";
import { PurchaseContext } from "@/context/PurchaseContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { Material } from "@/services/material/type";
import {
  MaterialPurchaseDTO,
  PurchaseDTO,
  SupplierPurchaseDTO,
} from "@/services/purchase/type";
import { SupplierRecord } from "@/services/supplier/type";
import {
  convertOrderTimeToDate,
  formatDateToHHMM,
  formatDateToYYYYMMDD,
} from "@/util/date";
import Cookies from "js-cookie";
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
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useState } from "react";

function PurchasePost() {
  const router = useRouter();

  const [newPurchase, setNewPurchase] = useState<PurchaseDTO>({
    material: [],
    centerCost: "",
    centerCostId: "",
    client: "",
    requestedDate: "",
    requestedTime: "",
    type: "",
    userId: Cookies.get("portal.id") as string,
    enabled: true,
  });

  const [listMaterialsPurchase, setListMaterialsPurchase] = useState<
    MaterialPurchaseDTO[]
  >([]);
  const [selectedMaterialsPurchase, setSelectedMaterialsPurchase] = useState<
    MaterialPurchaseDTO[]
  >([]);

  const [selectedSupplierPurchase1, setSelectedSupplierPurchase1] =
    useState<SupplierPurchaseDTO>({
      supplierId: "",
      shortenedName: "",
      unitValue: null,
      totalValue: null,
    });

  const [selectedSupplierPurchase2, setSelectedSupplierPurchase2] =
    useState<SupplierPurchaseDTO>({
      supplierId: "",
      shortenedName: "",
      unitValue: null,
      totalValue: null,
    });

  const [selectedSupplierPurchase3, setSelectedSupplierPurchase3] =
    useState<SupplierPurchaseDTO>({
      supplierId: "",
      shortenedName: "",
      unitValue: null,
      totalValue: null,
    });

  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();

  const [selectedSupplier1, setSelectedSupplier1] = useState<SupplierRecord>();
  const [selectedSupplier2, setSelectedSupplier2] = useState<SupplierRecord>();
  const [selectedSupplier3, setSelectedSupplier3] = useState<SupplierRecord>();
  const [showAddMaterial, setShowAddMaterial] = useState<boolean>(false);
  const [deleteMaterialsDialog, setDeleteMaterialsDialog] =
    useState<boolean>(false);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);

  const [newRequestDate, setNewRequestDate] = useState<Date | null>(null);
  const [newRequestTime, setNewRequestTime] = useState<Date | null>(null);
  const [invalidRequestDate, setInvalidRequestDate] = useState<boolean>(false);
  const [invalidRequestTime, setInvalidRequestTime] = useState<boolean>(false);
  const [invalidMaterial, setInvalidMaterial] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidSupplierPurchase1, setInvalidSupplierPurchase1] =
    useState<boolean>(false);
  const [invalidSupplierPurchase2, setInvalidSupplierPurchase2] =
    useState<boolean>(false);
  const [invalidSupplierPurchase3, setInvalidSupplierPurchase3] =
    useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidUnitValue1, setInvalidUnitValue1] = useState<boolean>(false);
  const [invalidUnitValue2, setInvalidUnitValue2] = useState<boolean>(false);
  const [invalidUnitValue3, setInvalidUnitValue3] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);

  const { handlePostPurchase } = useContext(PurchaseContext);

  useEffect(() => {
    setNewPurchase((prevPurchase) => ({
      ...prevPurchase,
      requestedTime:
        formatDateToHHMM(newRequestTime) || prevPurchase.requestedTime,
      requestedDate:
        formatDateToYYYYMMDD(newRequestDate) || prevPurchase.requestedDate,
      userId:
        (localStorage.getItem("portal.id") as string) || prevPurchase.userId,
    }));
  }, [newRequestTime, newRequestDate]);

  async function validateFields() {
    setNewPurchase({
      ...newPurchase,
      centerCost: selectedConstruction?.code || "",
      centerCostId: selectedConstruction?.id || "",
      client: selectedConstruction?.client || "",
    });
    setInvalidConstructionCode(
      !newPurchase.centerCost || newPurchase.centerCost === ""
    );
    setInvalidMaterial(
      !newPurchase.material || newPurchase.material.length <= 0
    );
    setInvalidRequestDate(!newRequestDate);
    setInvalidRequestTime(!newRequestTime);

    if (
      !invalidConstructionCode &&
      !invalidMaterial &&
      !invalidRequestTime &&
      !invalidRequestDate
    ) {
      await handlePostPurchase(newPurchase);
      router.back();
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

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

  const { allSuppliersShortenedName, handleGetAllShortenedName } =
    useContext(SupplierContext);

  const [allSupplierItems, setAllSupplierItems] = useState<SupplierRecord[]>(
    allSuppliersShortenedName
  );

  const { allMaterials, handleGetAllMaterials } = useContext(MaterialContext);

  const [materialsItems, setMaterialsItems] =
    useState<Material[]>(allMaterials);

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
      setMaterialsItems(_filteredMaterials);
    });
  };

  useEffect(() => {
    setNewPurchase((prevPurchase) => ({
      ...prevPurchase,
      centerCost: selectedConstruction?.code || prevPurchase.centerCost,
      centerCostId: selectedConstruction?.id || prevPurchase.centerCostId,
    }));
  }, [selectedConstruction]);

  const [newMaterialPurchase, setNewMaterialPurchase] =
    useState<MaterialPurchaseDTO>({
      name: "",
      quantity: null,
      unit: "",
      supplierPurchase: [],
    });
  const [newSupplierPurchase, setNewSupplierPurchase] = useState<
    SupplierPurchaseDTO[]
  >([]);
  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Novo"
          icon="pi pi-plus"
          onClick={() => {
            if (!materialsItems) alert("Cadastre materiais");
            setShowAddMaterial(true);
            setNewSupplierPurchase([]);
            setNewQuantity(null);
            setInvalidSupplierPurchase1(false);
            setInvalidSupplierPurchase2(false);
            setInvalidSupplierPurchase3(false);
            setInvalidUnitValue1(false);
            setInvalidUnitValue2(false);
            setInvalidUnitValue3(false);
          }}
          severity="success"
        />
        <Button
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={
            !selectedMaterialsPurchase || !selectedMaterialsPurchase.length
          }
        />
      </div>
    );
  };

  const confirmDeleteSelected = () => {
    setDeleteMaterialsDialog(true);
  };

  const hideAddDialog = () => {
    setShowAddMaterial(false);
    setInvalidName(false);
    setInvalidQuantity(false);
    setInvalidSupplierPurchase1(false);
    setInvalidSupplierPurchase2(false);
    setInvalidSupplierPurchase3(false);
    setNewMaterialPurchase({
      name: "",
      quantity: null,
      unit: "",
      supplierPurchase: [],
    });
    setNewQuantity(null);
    setSelectedSupplierPurchase1({
      supplierId: selectedSupplierPurchase1.supplierId,
      shortenedName: selectedSupplierPurchase1.shortenedName,
      unitValue: null,
      totalValue: null,
    });
    setSelectedSupplierPurchase2({
      supplierId: selectedSupplierPurchase2.supplierId,
      shortenedName: selectedSupplierPurchase2.shortenedName,
      unitValue: null,
      totalValue: null,
    });
    setSelectedSupplierPurchase3({
      supplierId: selectedSupplierPurchase3.supplierId,
      shortenedName: selectedSupplierPurchase3.shortenedName,
      unitValue: null,
      totalValue: null,
    });
    setNewSupplierPurchase([]);
  };

  function validateFieldsMaterial() {
    validateSupplierFields();
    setInvalidName(
      !newMaterialPurchase.name || newMaterialPurchase.name === ""
    );
    setInvalidQuantity(!newQuantity);
    setInvalidSupplierPurchase1(
      !newSupplierPurchase || newSupplierPurchase.length <= 0
    );
    setInvalidSupplierPurchase2(
      !newSupplierPurchase || newSupplierPurchase.length <= 0
    );
    setInvalidSupplierPurchase3(
      !newSupplierPurchase || newSupplierPurchase.length <= 0
    );

    if (
      !invalidName &&
      !invalidQuantity &&
      !invalidSupplierPurchase1 &&
      !invalidSupplierPurchase2 &&
      !invalidSupplierPurchase3
    ) {
      setListMaterialsPurchase([
        ...listMaterialsPurchase,
        {
          name: newMaterialPurchase.name,
          unit: newMaterialPurchase.unit,
          quantity: newQuantity,
          supplierPurchase: newSupplierPurchase,
        },
      ]);
      hideAddDialog();
    }
  }

  const deletedSelectedMaterialsPurchase = () => {
    let _materialsPurchase = listMaterialsPurchase.filter(
      (materialPurchase) =>
        !selectedMaterialsPurchase.includes(materialPurchase)
    );
    setListMaterialsPurchase(_materialsPurchase);
    setDeleteMaterialsDialog(false);
    setSelectedMaterialsPurchase([]);
  };

  const hideDeleteMaterialsPurchaseDialog = () => {
    setDeleteMaterialsDialog(false);
  };

  useEffect(() => {
    setNewPurchase({
      ...newPurchase,
      material: listMaterialsPurchase,
    });
  }, [listMaterialsPurchase]);

  const deleteMaterialsDialogFooter = (
    <React.Fragment>
      <Button
        label="Não"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteMaterialsPurchaseDialog}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        severity="danger"
        onClick={deletedSelectedMaterialsPurchase}
      />
    </React.Fragment>
  );

  const suppliersSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliersShortenedName];
      } else {
        _filteredSuppliers = allSuppliersShortenedName.filter((supplier) => {
          return supplier.shortenedName
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllSupplierItems(_filteredSuppliers);
    }, 150);
  };

  function validateSupplierFields() {
    setInvalidSupplierPurchase1(
      !selectedSupplierPurchase1.shortenedName ||
        selectedSupplierPurchase1.shortenedName === ""
    );
    setInvalidSupplierPurchase2(
      !selectedSupplierPurchase2.shortenedName ||
        selectedSupplierPurchase2.shortenedName === ""
    );
    setInvalidSupplierPurchase3(
      !selectedSupplierPurchase3.shortenedName ||
        selectedSupplierPurchase3.shortenedName === ""
    );
    setInvalidUnitValue1(
      !selectedSupplierPurchase1.unitValue ||
        selectedSupplierPurchase1.unitValue === null
    );
    setInvalidUnitValue2(
      !selectedSupplierPurchase2.unitValue ||
        selectedSupplierPurchase2.unitValue === null
    );
    setInvalidUnitValue3(
      !selectedSupplierPurchase3.unitValue ||
        selectedSupplierPurchase3.unitValue === null
    );
    if (
      selectedSupplierPurchase1.shortenedName &&
      selectedSupplierPurchase1.unitValue !== null &&
      selectedSupplierPurchase2.shortenedName &&
      selectedSupplierPurchase2.unitValue !== null &&
      selectedSupplierPurchase3.shortenedName &&
      selectedSupplierPurchase3.unitValue !== null
    ) {
      // Add the validated supplier to the listSupplierPurchase
      let listSupplier = newSupplierPurchase;
      listSupplier.push(selectedSupplierPurchase1);
      listSupplier.push(selectedSupplierPurchase2);
      listSupplier.push(selectedSupplierPurchase3);
      setNewSupplierPurchase(listSupplier);

      // Clear the selected supplier state for the next entry
      setSelectedSupplierPurchase1({
        supplierId: selectedSupplierPurchase1.supplierId,
        shortenedName: selectedSupplierPurchase1.shortenedName,
        unitValue: null,
        totalValue: null,
      });
      setSelectedSupplierPurchase2({
        supplierId: selectedSupplierPurchase2.supplierId,
        shortenedName: selectedSupplierPurchase2.shortenedName,
        unitValue: null,
        totalValue: null,
      });
      setSelectedSupplierPurchase3({
        supplierId: selectedSupplierPurchase3.supplierId,
        shortenedName: selectedSupplierPurchase3.shortenedName,
        unitValue: null,
        totalValue: null,
      });
      setInvalidSupplierPurchase1(false);
      setInvalidSupplierPurchase2(false);
      setInvalidSupplierPurchase3(false);
    }
  }

  useEffect(() => {
    handleGetAllShortenedName();
    handleGetAllMaterials();
  }, []);

  useEffect(() => {
    setSelectedSupplierPurchase1((prevSelectedSupplierPurchase1) => ({
      ...prevSelectedSupplierPurchase1,
      supplierId:
        selectedSupplier1?.id || prevSelectedSupplierPurchase1.supplierId,
      shortenedName:
        selectedSupplier1?.shortenedName ||
        prevSelectedSupplierPurchase1.shortenedName,
    }));
    setSelectedSupplierPurchase2((prevSelectedSupplierPurchase2) => ({
      ...prevSelectedSupplierPurchase2,
      supplierId:
        selectedSupplier2?.id || prevSelectedSupplierPurchase2.supplierId,
      shortenedName:
        selectedSupplier2?.shortenedName ||
        prevSelectedSupplierPurchase2.shortenedName,
    }));
    setSelectedSupplierPurchase3((prevSelectedSupplierPurchase3) => ({
      ...prevSelectedSupplierPurchase3,
      supplierId:
        selectedSupplier3?.id || prevSelectedSupplierPurchase3.supplierId,
      shortenedName:
        selectedSupplier3?.shortenedName ||
        prevSelectedSupplierPurchase3.shortenedName,
    }));
  }, [selectedSupplier1, selectedSupplier2, selectedSupplier3]);

  const formatCurrencyReal = (value: number | null) => {
    if (!value) {
      return null;
    }
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const priceTotalValueBodyTemplate = (supplier: SupplierPurchaseDTO) => {
    return formatCurrencyReal(supplier.totalValue || null);
  };

  const priceUnitValueBodyTemplate = (supplier: SupplierPurchaseDTO) => {
    return formatCurrencyReal(supplier.unitValue || null);
  };

  return (
    <>
      <Card className="m-3">
        <section className="flex flex-column gap-2 p-5 w-full overflow-y: auto">
          <h1 className="text-xl m-0">Cadastrar Compra</h1>
          <div className="card flex flex-column md:flex-row gap-3 w-full">
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Data"
                htmlFor="requestDate"
                className="font-semibold"
              />
              <Calendar
                id="buttondisplay"
                onChange={(e) => {
                  setNewRequestDate(e.value || null);
                  setInvalidRequestDate(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newRequestDate}
                locale="pt"
                className="ui-state-default"
                dateFormat="dd/mm/yy"
                showIcon
              />
              {invalidRequestDate && (
                <Message
                  severity="error"
                  text="Data é obrigatória"
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
                  setNewRequestTime(e.value || null);
                  setInvalidRequestTime(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={newRequestTime}
                locale="pt"
                className="ui-state-default"
                dateFormat="dd/mm/yy"
                showIcon
                timeOnly
              />
              {invalidRequestTime && (
                <Message
                  severity="error"
                  text="Hora é obrigatória"
                  className="smaller-text"
                />
              )}
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Código da Obra"
                htmlFor="constructionCode"
                className="font-semibold"
              />
              <AutoComplete
                type="text"
                field="code"
                dropdown
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={selectedConstruction}
                suggestions={constructionsItems}
                completeMethod={constructionSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedConstruction(e.value);
                  setInvalidConstructionCode(false);
                }}
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
          <Card>
            <h3>Cadastrar Materiais</h3>
            <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
            <DataTable
              emptyMessage="Nenhum material adicionado"
              value={listMaterialsPurchase}
              rows={10}
              selection={selectedMaterialsPurchase}
              onSelectionChange={(e) => {
                if (Array.isArray(e.value)) {
                  setSelectedMaterialsPurchase(e.value);
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
            {/* <MaterialAccordion
              listMaterialsPurchase={listMaterialsPurchase}
              setListMaterialsPurchase={setListMaterialsPurchase}
            /> */}
          </Card>
          {invalidMaterial && (
            <Message
              severity="error"
              text="Pelo menos um material é obrigatório"
              className="smaller-text"
            />
          )}
          <div className="flex gap-2">
            <Button
              className="w-full"
              label="Cancelar"
              outlined
              onClick={() => {
                router.back();
              }}
            />
            <Button
              onClick={() => validateFields()}
              className="w-full"
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
        onHide={hideAddDialog}
        className="p-fluid w-70rem"
        style={{ width: "70vw" }}
      >
        <div className="card flex flex-column md:flex-row gap-3 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome"
              htmlFor="name"
              className="font-semibold"
              required={true}
            />
            <AutoComplete
              type="text"
              field="name"
              value={newMaterialPurchase}
              suggestions={materialsItems}
              completeMethod={materialSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setNewMaterialPurchase(e.value);
                setInvalidName(false);
              }}
              dropdown
              forceSelection
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidName && (
              <Message
                severity="error"
                text="Nome do Material é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-2 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Unidade"
              htmlFor="unit"
              className="font-semibold"
            />
            <InputText
              type="text"
              onChange={(e) => {
                setNewMaterialPurchase({
                  ...newMaterialPurchase,
                  unit: e.target.value,
                });
              }}
              value={newMaterialPurchase?.unit}
              disabled
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
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
            {invalidQuantity && (
              <Message
                severity="error"
                text="Quantidade é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        <Card className="m-1">
          <div className="card flex flex-column md:flex-row gap-2 w-full">
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Fornecedor I"
                htmlFor="supplier"
                className="font-semibold"
                required={true}
              />
              <AutoComplete
                suggestions={allSupplierItems}
                dropdown
                style={{ height: "30px", fontSize: "0.75rem" }}
                field="shortenedName"
                value={selectedSupplierPurchase1.shortenedName}
                completeMethod={suppliersSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedSupplier1(e.value);
                  setInvalidSupplierPurchase1(false);
                }}
              />
              <LabelTitle
                text="Valor Unitário"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase1?.unitValue)}
                onChange={(e) => {
                  if (e.value) {
                    setSelectedSupplierPurchase1({
                      ...selectedSupplierPurchase1,
                      unitValue: e.value * 100,
                      totalValue:
                        newQuantity != null
                          ? e.value * newQuantity * 100
                          : null,
                    });
                  }
                  setInvalidUnitValue1(false);
                }}
              />
              <LabelTitle
                text="Valor Total"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase1.totalValue)}
                disabled
              />
              {(invalidSupplierPurchase1 || invalidUnitValue1) && (
                <Message
                  severity="error"
                  text="Pelo menos um fornecedor é obrigatório"
                  className="smaller-text"
                />
              )}
              {/* <Button
                label="Adicionar Fornecedor >"
                outlined
                onClick={() => validateSupplierFields()}
              /> */}
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Fornecedor II"
                htmlFor="supplier"
                className="font-semibold"
                required={true}
              />
              <AutoComplete
                suggestions={allSupplierItems}
                dropdown
                style={{ height: "30px", fontSize: "0.75rem" }}
                field="shortenedName"
                value={selectedSupplierPurchase2.shortenedName}
                completeMethod={suppliersSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedSupplier2(e.value);
                  setInvalidSupplierPurchase2(false);
                }}
              />
              <LabelTitle
                text="Valor Unitário"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase2?.unitValue)}
                onChange={(e) => {
                  if (e.value) {
                    setSelectedSupplierPurchase2({
                      ...selectedSupplierPurchase2,
                      unitValue: e.value * 100,
                      totalValue:
                        newQuantity != null
                          ? e.value * newQuantity * 100
                          : null,
                    });
                  }
                  setInvalidUnitValue2(false);
                }}
              />
              <LabelTitle
                text="Valor Total"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase2.totalValue)}
                disabled
              />
              {(invalidSupplierPurchase2 || invalidUnitValue2) && (
                <Message
                  severity="error"
                  text="Fornecedor II é obrigatório"
                  className="smaller-text"
                />
              )}
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Fornecedor III"
                htmlFor="supplier"
                className="font-semibold"
                required={true}
              />
              <AutoComplete
                suggestions={allSupplierItems}
                dropdown
                style={{ height: "30px", fontSize: "0.75rem" }}
                field="shortenedName"
                value={selectedSupplierPurchase3.shortenedName}
                completeMethod={suppliersSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedSupplier3(e.value);
                  setInvalidSupplierPurchase3(false);
                }}
              />
              <LabelTitle
                text="Valor Unitário"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase3?.unitValue)}
                onChange={(e) => {
                  if (e.value) {
                    setSelectedSupplierPurchase3({
                      ...selectedSupplierPurchase3,
                      unitValue: e.value * 100,
                      totalValue:
                        newQuantity != null
                          ? e.value * newQuantity * 100
                          : null,
                    });
                  }
                  setInvalidUnitValue3(false);
                }}
              />
              <LabelTitle
                text="Valor Total"
                htmlFor="value"
                className="font-semibold"
              />
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={formatCurrency(selectedSupplierPurchase3.totalValue)}
                disabled
              />
              {(invalidSupplierPurchase3 || invalidUnitValue3) && (
                <Message
                  severity="error"
                  text="Fornecedor III é obrigatório"
                  className="smaller-text"
                />
              )}
            </div>
            {/* <div className="field flex flex-column gap-2 w-full">
              <DataTable
                emptyMessage="Nenhum fornecedor adicionado"
                value={newSupplierPurchase}
                rows={10}
                dataKey="id"
              >
                <Column field="shortenedName" header="Fornecedor"></Column>
                <Column
                  field="unitValue"
                  header="Valor Unitário"
                  body={priceUnitValueBodyTemplate}
                ></Column>
                <Column
                  field="totalValue"
                  header="Valor Total"
                  body={priceTotalValueBodyTemplate}
                ></Column>
              </DataTable>
            </div> */}
          </div>
        </Card>
        <div className="flex gap-2 m-1">
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
        onHide={hideDeleteMaterialsPurchaseDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedMaterialsPurchase && (
            <span>
              Tem certeza que dejeja excluir os materiais selecionados?
            </span>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default PurchasePost;
