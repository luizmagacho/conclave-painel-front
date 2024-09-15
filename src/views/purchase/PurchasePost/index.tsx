import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { MaterialContext } from "@/context/MaterialContext";
import { PurchaseContext } from "@/context/PurchaseContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { Material } from "@/services/material/type";
import { PurchaseDTO } from "@/services/purchase/type";
import { Supplier } from "@/services/supplier/type";
import { formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

function PurchasePost() {
  const router = useRouter();
  let name;
  let id;
  if (typeof window !== "undefined") {
    name = window.localStorage.getItem("portal.name");
    id = window.localStorage.getItem("portal.id");
  }
  const [newPurchase, setNewPurchase] = useState<PurchaseDTO>({
    material: "",
    centerCost: "",
    centerCostId: "",
    purchaseDate: "",
    quantity: null,
    requestedDate: "",
    totalValue: null,
    type: "",
    unitValue: null,
    userId: "",
    enabled: true,
  });

  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();

  const [newPurchaseDate, setNewPurchaseDate] = useState<Date | null>(null);
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [newRequestDate, setNewRequestDate] = useState<Date | null>(null);
  const [newRequestTime, setNewRequestTime] = useState<Date | null>(null);
  const [invalidRequestDate, setInvalidRequestDate] = useState<boolean>(false);
  const [invalidRequestTime, setInvalidRequestTime] = useState<boolean>(false);
  const [invalidMaterial, setInvalidMaterial] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidUnitValue, setInvalidUnitValue] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);

  const { handlePostPurchase } = useContext(PurchaseContext);

  useEffect(() => {
    setNewPurchase((prevPurchase) => ({
      ...prevPurchase,
      purchaseDate:
        formatDateToYYYYMMDD(newPurchaseDate) || prevPurchase.purchaseDate,
      requestedDate:
        formatDateToYYYYMMDD(newRequestDate) || prevPurchase.requestedDate,
    }));
  }, [newPurchaseDate, newRequestDate]);

  async function validateFields() {
    setNewPurchase({
      ...newPurchase,
      centerCost: selectedConstruction?.code || "",
    });
    setNewPurchase({
      ...newPurchase,
      centerCostId: selectedConstruction?.id || "",
    });
    setInvalidConstructionCode(
      !newPurchase.centerCost || newPurchase.centerCost === ""
    );
    setInvalidMaterial(!newPurchase.quantity || newPurchase.material === "");
    setInvalidQuantity(!newPurchase.unitValue || newPurchase.quantity === null);
    setInvalidUnitValue(
      !newPurchase.unitValue || newPurchase.unitValue === null
    );
    setInvalidPurchaseDate(!newPurchaseDate);
    setInvalidRequestDate(!newRequestDate);

    if (
      !invalidConstructionCode &&
      !invalidMaterial &&
      !invalidPurchaseDate &&
      !invalidRequestDate &&
      !invalidQuantity &&
      !invalidUnitValue
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

  const { allSuppliers } = useContext(SupplierContext);

  const [suppliersItems, setSuppliersItems] =
    useState<Supplier[]>(allSuppliers);

  const supplierSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliers];
      } else {
        _filteredSuppliers = suppliersItems.filter((supplier) => {
          return supplier.shortenedName.startsWith(event.query);
        });
        setSuppliersItems(_filteredSuppliers);
      }
    }, 150);
  };

  const { allMaterials } = useContext(MaterialContext);

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
        setMaterialsItems(_filteredMaterials);
      }
    });
  };

  useEffect(() => {
    if (
      newPurchase.unitValue &&
      newPurchase.unitValue !== null &&
      newPurchase.quantity
    ) {
      setNewPurchase({
        ...newPurchase,
        totalValue: newPurchase.quantity * newPurchase.unitValue,
      });
    }
  }, [newPurchase.unitValue, newPurchase.quantity]);

  useEffect(() => {
    setNewPurchase((prevPurchase) => ({
      ...prevPurchase,
      centerCost: selectedConstruction?.code || prevPurchase.centerCost,
      centerCostId: selectedConstruction?.id || prevPurchase.centerCostId,
    }));
  }, [selectedConstruction]);

  return (
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
                text="Data de Pedido é obrigatório"
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
                text="Data de Pedido é obrigatório"
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
        <div className="card flex flex-column md:flex-row gap-3 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Material"
              htmlFor="material"
              className="font-semibold"
            />
            <InputText
              type="text"
              onChange={(e) => {
                setNewPurchase({
                  ...newPurchase,
                  material: e.target.value,
                });
              }}
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={newPurchase?.material}
            />
            {invalidMaterial && (
              <Message
                severity="error"
                text="Material é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Valor Unitário"
              htmlFor="unitValue"
              className="font-semibold text-sm"
              required={true}
            />
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              onChange={(e) => {
                if (e.value) {
                  setNewPurchase({
                    ...newPurchase,
                    unitValue: e.value * 100,
                  });
                }
                setInvalidUnitValue(false);
              }}
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={formatCurrency(newPurchase?.unitValue)}
            />
            {invalidUnitValue && (
              <Message severity="error" text="Valor Unitário é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Quantidade"
              htmlFor="quantity"
              className="font-semibold text-sm"
              required={true}
            />
            <InputNumber
              onChange={(e) => {
                if (e.value) {
                  setNewPurchase({
                    ...newPurchase,
                    quantity: e.value,
                  });
                }
                setInvalidQuantity(false);
              }}
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={newPurchase?.quantity}
            />
            {invalidQuantity && (
              <Message severity="error" text="Quantidade é obrigatório" />
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Valor Total"
              htmlFor="totalValue"
              className="font-semibold text-sm"
            />
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              value={formatCurrency(newPurchase?.totalValue)}
              disabled={true}
            />
          </div>
        </div>
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
            className="w-full"
            label="Salvar"
            severity="danger"
            onClick={() => validateFields()}
          />
        </div>
      </section>
    </Card>
  );
}

export default PurchasePost;
