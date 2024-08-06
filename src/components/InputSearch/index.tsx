import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

interface InputSearchProps {
  onSearch: (userName: string) => void;
  onChange: (userName: string) => void;
  inputType?: string;
}

function InputSearch({ onSearch, onChange, inputType }: InputSearchProps) {
  function searchUserByName(name: string) {
    if ((inputType === "Nome" || inputType === null) && name.length >= 3) {
      onSearch(name);
      onChange(name);
    } else {
      onSearch(name);
      onChange(name);
    }
  }
  return (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search"> </InputIcon>
      <InputText
        placeholder="Buscar"
        className="w-12"
        onChange={(e) => {
          searchUserByName(e.target.value);
        }}
      />
    </IconField>
  );
}

export default InputSearch;
