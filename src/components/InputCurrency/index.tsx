import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import React, { useState } from "react";
import Calculator from "../Calculator";
import { Dialog } from "primereact/dialog";

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange }) => {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleValueChange = (newValue: number) => {
    onChange(newValue);
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  return (
    <div className="currency-input">
      <InputNumber
        inputId="currency-br"
        mode="currency"
        locale="pt-BR"
        currency="BRL"
        style={{ height: "30px", fontSize: "0.8rem" }}
        className="smaller-text"
        value={value}
        onChange={(e) => {
          handleValueChange(e.value || 0);
        }}
      />
      <Button
        icon="pi pi-calculator"
        className="calculator-button"
        onClick={toggleCalculator}
      />
      {showCalculator && (
        <Dialog
          onHide={() => setShowCalculator(false)}
          visible={showCalculator}
        >
          <Calculator
            value={value || 0}
            setValue={handleValueChange}
            onClose={toggleCalculator}
          />
        </Dialog>
      )}
    </div>
  );
};

export default CurrencyInput;
