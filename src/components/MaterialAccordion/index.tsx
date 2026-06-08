import React, { useContext, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { MaterialPurchaseDTO } from "@/services/purchase/type";
import { InputNumber } from "primereact/inputnumber";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import LabelTitle from "../LabelTitle";
import { Material } from "@/services/material/type";
import { MaterialContext } from "@/context/MaterialContext";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";

interface MaterialAccordionProps {
  listMaterialsPurchase: MaterialPurchaseDTO[];
  setListMaterialsPurchase: (materials: MaterialPurchaseDTO[]) => void;
}

function MaterialAccordion({
  listMaterialsPurchase,
  setListMaterialsPurchase,
}: MaterialAccordionProps) {
  const [newQuantity, setNewQuantity] = useState<number | null>(null);

  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidName, setInvalidName] = useState<boolean>(false);

  const { allMaterials, handleGetAllMaterials } = useContext(MaterialContext);
  const [materialsItems, setMaterialsItems] =
    useState<Material[]>(allMaterials);

  const [newMaterialPurchase, setNewMaterialPurchase] =
    useState<MaterialPurchaseDTO>({
      name: "",
      quantity: null,
      unit: "",
      supplierPurchase: [],
    });

  const addMaterial = () => {
    setListMaterialsPurchase([...listMaterialsPurchase, newMaterialPurchase]);
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
      setMaterialsItems(_filteredMaterials);
    });
  };

  const renderAccordionContent = (index: number) => {
    return (
      <div>
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
              suggestions={materialsItems as any}
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
      </div>
    );
  };

  return (
    <div>
      <ScrollPanel style={{ width: "100%", height: "200px" }}>
        <Button label="Adicionar Material" onClick={addMaterial} />
        <Accordion multiple activeIndex={listMaterialsPurchase.length - 1}>
          {listMaterialsPurchase.map((materialsPurchase, index) => (
            <AccordionTab header={`Material ${index + 1}`} key={index}>
              {renderAccordionContent(index)}
            </AccordionTab>
          ))}
        </Accordion>
      </ScrollPanel>
    </div>
  );
}

export default MaterialAccordion;
