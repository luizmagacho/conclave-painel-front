import LabelTitle from "@/components/LabelTitle";
import { MaterialContext } from "@/context/MaterialContext";
import { Material } from "@/services/material/type";
import {
  MaterialPurchase,
  MaterialPurchaseDTO,
} from "@/services/purchase/type";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface MaterialSupplierPurchaseCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (materialPurchase: MaterialPurchase) => void;
}

function MaterialSupplierPurchaseCreateDialog({
  visible,
  onHide,
  onCreate,
}: MaterialSupplierPurchaseCreateDialog) {
  const router = useRouter();

  const [newMaterialPurchase, setNewMaterialPurchase] =
    useState<MaterialPurchaseDTO>({
      name: "",
      quantity: null,
      unit: "",
      supplierPurchase: [],
    });

  const [selectedMaterial, setSelectedMaterial] = useState<Material>();

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUnit, setInvalidUnit] = useState<boolean>(false);

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
          return material.name
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setMaterialsItems(_filteredMaterials);
      if (_filteredMaterials.length === 0) setMaterialsItems(allMaterials);
    }, 150);
  };

  useEffect(() => {
    setNewMaterialPurchase((prevMaterialPurchase) => ({
      ...prevMaterialPurchase,
      unit: selectedMaterial?.unit || prevMaterialPurchase.unit,
    }));
  }, [selectedMaterial]);

  return (
    <Dialog
      header="Adicionar Novo Material de Compras"
      visible={visible}
      onHide={onHide}
      className="w-50rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="Nome" htmlFor="name" className="font-semibold" />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="name"
              dropdown
              value={selectedMaterial}
              suggestions={materialsItems as any}
              completeMethod={materialSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedMaterial(e.value)
              }
              className="flex-grow font-semibold" /* Faz o elemento preencher o espaço restante */
              style={{ height: "30px", fontSize: "0.8rem" }}
            />
            {invalidName && (
              <Message
                severity="error"
                text="Nome é obrigatório"
                style={{ height: "30px", fontSize: "0.4rem" }}
              />
            )}
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Quantidade"
            htmlFor="quantity"
            className="font-semibold"
          />
          <InputNumber
            type="text"
            onChange={(e) => {
              setNewMaterialPurchase({
                ...newMaterialPurchase,
                quantity: e.value,
              });
              setInvalidUnit(false);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            className="smaller-text"
            value={newMaterialPurchase?.quantity}
          />
          {invalidUnit && (
            <Message severity="error" text="Unidade é obrigatório" />
          )}
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
              setNewMaterialPurchase({
                ...newMaterialPurchase,
                unit: e.target.value,
              });
            }}
            value={newMaterialPurchase.unit}
          />
        </div>
      </div>
    </Dialog>
  );
}
