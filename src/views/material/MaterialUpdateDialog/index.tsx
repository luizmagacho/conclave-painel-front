import LabelTitle from "@/components/LabelTitle";
import { Material } from "@/services/material/type";
import { Dialog } from "primereact/dialog";
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
        <div className="formgrid grid">
          <div className="field col">
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
                setInvalidMetricUnit(false);
              }}
              value={updatedMaterial.quantity}
            />
            {invalidQuantity && (
              <Message severity="error" text="Quantidade é obrigatório" />
            )}
          </div>
          <div className="field col">
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
      </div>
    </Dialog>
  );
}
