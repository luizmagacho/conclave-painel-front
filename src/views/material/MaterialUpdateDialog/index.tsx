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
    observation: data.observation,
    unit: data.unit,
    enabled: data.enabled,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUnit, setInvalidUnit] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!updatedMaterial.name || updatedMaterial.name === "");
    setInvalidUnit(!updatedMaterial.unit || updatedMaterial.unit === "");
    if (!invalidName && !invalidUnit) {
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
            text="Unidade"
            htmlFor="unit"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedMaterial({
                ...updatedMaterial,
                unit: e.target.value,
              });
              setInvalidUnit(false);
            }}
            value={updatedMaterial.unit}
          />
          {invalidUnit && (
            <Message severity="error" text="Unidade é obrigatória" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Observações"
            htmlFor="observation"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedMaterial({
                ...updatedMaterial,
                observation: e.target.value,
              });
            }}
            value={updatedMaterial.observation}
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

export default MaterialUpdateDialog;
