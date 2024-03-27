import { InputMask } from "primereact/inputmask";

interface PhoneInputProps {
  name: string;
  placeholder: string;
  setFieldValue: (name: string, value: string) => void;
  value?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  const { name, placeholder, setFieldValue, value } = props;

  // Remove formatting and re-format after.
  // Necessary to resolve bugs with formatting and auto-complete
  const ajusta = (v: string): string => {
    const digitos = !v ? "" : v.replace(/[^\d]/g, "");
    if (!digitos || digitos.length < 10) return v;
    const corte = digitos.length === 10 ? 6 : 7;
    const max = digitos.length > 11 ? 11 : digitos.length;
    return `(${digitos.substring(0, 2)}) ${digitos.substring(
      2,
      corte
    )}-${digitos.substring(corte, max)}`;
  };

  const maskBuilder = (v: string): string => {
    if (!v || v.length === 0) return "";
    const a = ajusta(v);
    return a.length >= 6 && a[5] === "9" ? "(99) 99999-9999" : "(99) 9999-9999";
  };

  return (
    <InputMask
      name={name}
      value={value}
      onChange={(e) => setFieldValue(name, ajusta(e.target.value || ""))}
      mask={maskBuilder(value || "")}
      placeholder={placeholder}
    ></InputMask>
  );
};

export default PhoneInput;
