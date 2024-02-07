import LabelTitle from "@/components/LabelTitle";
import { MaterialDTO } from "@/services/material/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
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
    quantity: "",
    metricUnit: "",
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidQuantity, setInvalidQuantity] = useState<boolean>(false);
  const [invalidMetricUnit, setInvalidMetricUnit] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!newMaterial.name || newMaterial.name === "");
    setInvalidQuantity(!newMaterial.quantity || newMaterial.quantity === "");
    setInvalidMetricUnit(
      !newMaterial.metricUnit || newMaterial.metricUnit === ""
    );
    if (!invalidName && !invalidQuantity && !invalidMetricUnit) {
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
        <div className="field gap-10">
          <div className="field flex flex-column gap-2">
            <LabelTitle
              text="Quantidade"
              htmlFor="quantity"
              className="font-semibold"
              required={true}
            />
            <InputText
              type="number"
              onChange={(e) => {
                setNewMaterial({ ...newMaterial, quantity: e.target.value });
                setInvalidQuantity(false);
              }}
              value={newMaterial?.quantity}
            />
            {invalidQuantity && (
              <Message severity="error" text="Quantidade é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2">
            <LabelTitle
              text="Unidade Métrica"
              htmlFor="metricUnit"
              className="font-semibold"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setNewMaterial({ ...newMaterial, metricUnit: e.target.value });
                setInvalidMetricUnit(false);
              }}
              value={newMaterial?.metricUnit}
            />
            {invalidMetricUnit && (
              <Message severity="error" text="Unidade métrica é obrigatório" />
            )}
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
