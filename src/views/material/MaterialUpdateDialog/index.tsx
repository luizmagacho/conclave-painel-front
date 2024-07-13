import LabelTitle from "@/components/LabelTitle";
import { Material } from "@/services/material/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

interface MaterialUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (material: Material) => void;
  data: Material;
}

function MaterialUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: MaterialUpdateDialog) {
  const [updatedMaterial, setUpdatedMaterial] = useState<Material>({
    id: data.id,
    name: data.name,
    quantity: data.quantity,
    metricUnit: data.metricUnit,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidMetricUnit, setInvalidMetricUnit] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!updatedMaterial.name || updatedMaterial.name === "");
    setInvalidQuantity(!updatedMaterial.quantity);
    setInvalidMetricUnit(
      !updatedMaterial.metricUnit || updatedMaterial.metricUnit === ""
    );
    if (!invalidName && !invalidQuantity && !invalidMetricUnit) {
      onUpdate(updatedMaterial);
      onHide();
    }
  }

  return (
    <Dialog
      header="Atualizar Material"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Nome"
            htmlFor="name"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedMaterial({ ...updatedMaterial, name: e.target.value });
              setInvalidName(false);
            }}
            value={updatedMaterial.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
        </div>
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
                setUpdatedMaterial({
                  ...updatedMaterial,
                  quantity: e.value,
                });
              }
              setInvalidQuantity(false);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedMaterial?.quantity}
          />
          {invalidQuantity && (
            <Message severity="error" text="Quantidade é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Quantidade"
            htmlFor="quantity"
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
              setInvalidQuantity(false);
            }}
            value={updatedMaterial.metricUnit}
          />
          {invalidMetricUnit && (
            <Message severity="error" text="Unidade métrica é obrigatória" />
          )}
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

export default MaterialUpdateDialog;
