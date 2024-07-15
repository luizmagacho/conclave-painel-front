import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";
import { Purchase } from "@/services/purchase/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
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

interface PurchaseUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (purchase: Purchase) => void;
  data: Purchase;
}

function PurchaseUpdateDialog({
  data,
  onHide,
  onUpdate,
  visible,
}: PurchaseUpdateDialog) {
  const [updatedPurchase, setUpdatedPurchase] = useState<Purchase>({
    id: data.id,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    material: data.material,
    purchaseDate: data.purchaseDate,
    purchaseDateFormatted: data.purchaseDateFormatted,
    requestedDate: data.requestedDate,
    requestedDateFormatted: data.requestedDateFormatted,
    unitValue: data.unitValue,
    quantity: data.quantity,
    totalValue: data.totalValue,
    type: data.type,
    userId: data.userId,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const { constructions } = useContext(ConstructionContext);

  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction | null>(() => {
      if (data.centerCostId) {
        const construction = constructions.find(
          (construction) => construction.id === data.centerCostId
        );
        if (construction) {
          return construction;
        }
      }
      return null;
    });

  const [updatedPurchaseDate, setUpdatedPurchaseDate] = useState<Date | null>(
    convertStringToDate(data.purchaseDate)
  );
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [updatedRequestDate, setUpdatedRequestDate] = useState<Date | null>(
    convertStringToDate(data.requestedDate)
  );
  const [invalidRequestDate, setInvalidRequestDate] = useState<boolean>(false);
  const [invalidMaterial, setInvalidMaterial] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidUnitValue, setInvalidUnitValue] = useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedPurchase((prevPurchase) => ({
      ...prevPurchase,
      purchaseDate:
        formatDateToYYYYMMDD(updatedPurchaseDate) || prevPurchase.purchaseDate,
      requestedDate:
        formatDateToYYYYMMDD(updatedRequestDate) || prevPurchase.requestedDate,
    }));
  }, [updatedPurchaseDate, updatedRequestDate]);

  async function validateFields() {
    setUpdatedPurchase({
      ...updatedPurchase,
      centerCost: selectedConstruction?.code || "",
    });
    setUpdatedPurchase({
      ...updatedPurchase,
      centerCostId: selectedConstruction?.id || "",
    });
    setInvalidCenterCost(
      !updatedPurchase.centerCost || updatedPurchase.centerCost === ""
    );
    setInvalidMaterial(
      !updatedPurchase.quantity || updatedPurchase.material === ""
    );
    setInvalidQuantity(
      !updatedPurchase.unitValue || updatedPurchase.quantity === null
    );
    setInvalidUnitValue(
      !updatedPurchase.unitValue || updatedPurchase.unitValue === null
    );
    setInvalidPurchaseDate(!updatedPurchaseDate);
    setInvalidRequestDate(!updatedRequestDate);
    setInvalidCenterCost(
      !updatedPurchase.centerCost || updatedPurchase.centerCost === ""
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
      onUpdate(updatedPurchase);
      onHide();
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

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
      updatedPurchase.unitValue &&
      updatedPurchase.unitValue !== null &&
      updatedPurchase.quantity
    ) {
      setUpdatedPurchase({
        ...updatedPurchase,
        totalValue: updatedPurchase.quantity * updatedPurchase.unitValue,
      });
    }
  }, [updatedPurchase.unitValue, updatedPurchase.quantity]);

  useEffect(() => {
    setUpdatedPurchase((prevPurchase) => ({
      ...prevPurchase,
      centerCost: selectedConstruction?.code || prevPurchase.centerCost,
      centerCostId: selectedConstruction?.id || prevPurchase.centerCostId,
    }));
  }, [selectedConstruction]);

  return (
    <Dialog
      header="Editar Compra"
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
              setUpdatedRequestDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedRequestDate}
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
              setUpdatedPurchaseDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPurchaseDate}
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
              setUpdatedPurchase({
                ...updatedPurchase,
                material: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPurchase?.material}
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
                setUpdatedPurchase({
                  ...updatedPurchase,
                  unitValue: e.value * 100,
                });
              }
              setInvalidUnitValue(false);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedPurchase?.unitValue)}
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
                setUpdatedPurchase({
                  ...updatedPurchase,
                  quantity: e.value,
                });
              }
              setInvalidQuantity(false);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPurchase?.quantity}
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
            value={formatCurrency(updatedPurchase?.totalValue)}
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

export default PurchaseUpdateDialog;
