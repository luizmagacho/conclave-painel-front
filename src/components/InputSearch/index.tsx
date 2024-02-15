import { InputText } from "primereact/inputtext";

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
    <span className="p-input-icon-left w-90">
      <i className="pi pi-search" />
      <InputText
        placeholder="Search"
        className="w-12"
        onChange={(e) => {
          searchUserByName(e.target.value);
        }}
      />
    </span>
  );
}

export default InputSearch;
