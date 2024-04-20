import { Button } from "primereact/button";
import React, { useState } from "react";

interface CalculatorProps {
  value: number;
  setValue: (value: number) => void;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({
  value,
  setValue,
  onClose,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  const handleNumberClick = (number: string) => {
    setDisplayValue(displayValue + number);
  };

  const handleOperatorClick = (operator: string) => {
    // Implementar lógica para calcular com o operador
    // Atualizar o valor de displayValue e value
  };

  const handleEqualClick = () => {
    // Implementar lógica para calcular o resultado final
    // Atualizar o valor de value
    onClose();
  };

  const handleClearClick = () => {
    setDisplayValue("");
  };

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="buttons">
        <div className="number-buttons">
          <Button onClick={() => handleNumberClick("7")}>7</Button>
          <Button onClick={() => handleNumberClick("8")}>8</Button>
          <Button onClick={() => handleNumberClick("9")}>9</Button>
          <Button onClick={() => handleNumberClick("4")}>4</Button>
          <Button onClick={() => handleNumberClick("5")}>5</Button>
          <Button onClick={() => handleNumberClick("6")}>6</Button>
          <Button onClick={() => handleNumberClick("1")}>1</Button>
          <Button onClick={() => handleNumberClick("2")}>2</Button>
          <Button onClick={() => handleNumberClick("3")}>3</Button>
          <Button onClick={() => handleNumberClick(".")}>.</Button>
          <Button onClick={() => handleNumberClick("0")}>0</Button>
        </div>
        <div className="operator-buttons">
          <Button onClick={() => handleOperatorClick("+")}>+</Button>
          <Button onClick={() => handleOperatorClick("-")}>-</Button>
          <Button onClick={() => handleOperatorClick("*")}>*</Button>
          <Button onClick={() => handleOperatorClick("/")}>/</Button>
          <Button onClick={handleEqualClick}>=</Button>
        </div>
        <Button onClick={handleClearClick}>C</Button>
      </div>
    </div>
  );
};

export default Calculator;
