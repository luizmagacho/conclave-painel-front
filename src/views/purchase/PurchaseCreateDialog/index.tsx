import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction, ConstructionDTO } from "@/services/construction/type";
import { PurchaseDTO } from "@/services/purchase/type";
import { formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";

interface PurchaseCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (purchase: PurchaseDTO) => void;
}

function PurchaseCreateDialog({
  visible,
  onCreate,
  onHide,
}: PurchaseCreateDialog) {
  const router = useRouter();
  const { id } = router.query;
  const userId = localStorage.getItem("portal.id");
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
    userId: userId || "",
    enabled: true,
  });

  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();

  const [newPurchaseDate, setNewPurchaseDate] = useState<Date | null>(null);
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [newRequestDate, setNewRequestDate] = useState<Date | null>(null);
  const [invalidRequestDate, setInvalidRequestDate] = useState<boolean>(false);
  const [invalidMaterial, setInvalidMaterial] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidUnitValue, setInvalidUnitValue] = useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);

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
    setInvalidCenterCost(
      !newPurchase.centerCost || newPurchase.centerCost === ""
    );
    setInvalidMaterial(!newPurchase.quantity || newPurchase.material === "");
    setInvalidQuantity(!newPurchase.unitValue || newPurchase.quantity === null);
    setInvalidUnitValue(
      !newPurchase.unitValue || newPurchase.unitValue === null
    );
    setInvalidPurchaseDate(!newPurchaseDate);
    setInvalidRequestDate(!newRequestDate);
    setInvalidCenterCost(
      !newPurchase.centerCost || newPurchase.centerCost === ""
    );

    if (
      !invalidCenterCost &&
      !invalidMaterial &&
      !invalidPurchaseDate &&
      !invalidRequestDate &&
      !invalidQuantity &&
      !invalidUnitValue &&
      !invalidCenterCost
    ) {
      onCreate(newPurchase);
      onHide();
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  const { constructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(constructions);

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
    }, 150);
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
    <Dialog
      header="Adicionar Nova Compra"
      visible={visible}
      onHide={onHide}
      className="w-50rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Pedido"
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
            text="Data da Compra"
            htmlFor="purchaseDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setNewPurchaseDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newPurchaseDate}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidPurchaseDate && (
            <Message
              severity="error"
              text="Data da Compra é obrigatório"
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

        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Código do Centro de Custo"
            htmlFor="centerCost"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="code"
              value={selectedConstruction}
              suggestions={constructionsItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedConstruction(e.value)
              }
              dropdown
              style={{ height: "30px", fontSize: "0.75rem" }}
            />
            {invalidMaterial && (
              <Message
                severity="error"
                text="Centro de Custo é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
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
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Salvar"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </Dialog>
  );
}

export default PurchaseCreateDialog;
