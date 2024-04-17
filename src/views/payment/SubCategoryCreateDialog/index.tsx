import LabelTitle from "@/components/LabelTitle";
import { SubCategoryDTO } from "@/services/payment/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

interface SubCategoryCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (subCategory: SubCategoryDTO) => void;
}

function SubCategoryCreateDialog({
  visible,
  onHide,
  onCreate,
}: SubCategoryCreateDialog) {
  const [newSubCategory, setNewSubCategory] = useState<SubCategoryDTO>({
    name: "",
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);

  async function validateFields() {
    setInvalidName(!newSubCategory.name || newSubCategory.name === "");

    if (!invalidName) {
      onCreate(newSubCategory);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Nova Sub-Categoria"
      visible={visible}
      onHide={onHide}
      className="w-50rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Cadastro Sub-Categoria"
            htmlFor="code"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewSubCategory({
                ...newSubCategory,
                name: e.target.value,
              });
              setInvalidName(false);
            }}
            value={newSubCategory?.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
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

export default SubCategoryCreateDialog;
