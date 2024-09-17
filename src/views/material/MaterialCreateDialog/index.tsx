import LabelTitle from "@/components/LabelTitle";
import { MaterialDTO } from "@/services/material/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

interface MaterialCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (material: MaterialDTO) => void;
}

function MaterialCreateDialog({
  visible,
  onHide,
  onCreate,
}: MaterialCreateDialog) {
  const [newMaterial, setNewMaterial] = useState<MaterialDTO>({
    name: "",
    observation: "",
    unit: "",
    enabled: true,
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUnit, setInvalidUnit] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!newMaterial.name || newMaterial.name === "");

    setInvalidUnit(!newMaterial.unit || newMaterial.unit === "");
    if (!invalidName && !invalidUnit) {
      onCreate(newMaterial);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Novo Material"
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
              setNewMaterial({ ...newMaterial, name: e.target.value });
              setInvalidName(false);
            }}
            value={newMaterial?.name}
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
              setNewMaterial({ ...newMaterial, unit: e.target.value });
              setInvalidUnit(false);
            }}
            value={newMaterial?.unit}
          />
          {invalidUnit && (
            <Message severity="error" text="Unidade é obrigatório" />
          )}
        </div>
        <div className="field gap-10">
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
                setNewMaterial({
                  ...newMaterial,
                  observation: e.target.value,
                });
              }}
              value={newMaterial.observation}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          onClick={() => validateFields()}
          className="w-full"
          label="Salvar"
          severity="danger"
        />
      </div>
    </Dialog>
  );
}

export default MaterialCreateDialog;
