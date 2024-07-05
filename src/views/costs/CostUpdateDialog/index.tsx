import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Cost } from "@/services/costs/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { useContext, useEffect, useState } from "react";

interface CostUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (cost: Cost) => void;
  data: Cost;
}

function CostUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: CostUpdateDialog) {
  const router = useRouter();
  const { id } = router.query;
  const { selectedConstruction } = useContext(ConstructionContext);
  const [updatedCost, setUpdatedCost] = useState<Cost>({
    id: data.id,
    name: data.name,
    centerCost: data.centerCost,
    centerCostId: data.centerCostId,
    purchaseDate: data.purchaseDate,
    purchaseDateFormatted: data.purchaseDateFormatted,
    paymentDeadline: data.paymentDeadline,
    paymentDeadlineFormatted: data.paymentDeadlineFormatted,
    bankBranch: data.bankBranch,
    localBank: data.localBank,
    costType: data.costType,
    costCategory: data.costCategory,
    workerValue: data.workerValue,
    materialValue: data.materialValue,
    inssValue: data.inssValue,
    valueRemas: data.valueRemas,
    paymentStatus: data.paymentStatus,
    totalAmount: data.totalAmount,
    vendorName: data.vendorName,
    userId: data.userId,
    enabled: data.enabled,
    additionalDetails: data.additionalDetails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  });
  const [updatedPurchaseDate, setUpdatedPurchaseDate] = useState<Date | null>(
    convertStringToDate(data.purchaseDate)
  );
  const [invalidPurchaseDate, setInvalidPurchaseDate] =
    useState<boolean>(false);
  const [updatedPaymentDeadline, setUpdatedPaymentDeadline] =
    useState<Date | null>(convertStringToDate(data.paymentDeadline));
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidWorkerValue, setInvalidWorkerValue] = useState<boolean>(false);
  const [invalidMaterialValue, setInvalidMaterialValue] =
    useState<boolean>(false);
  const [invalidValueRemas, setInvalidValueRemas] = useState<boolean>(false);
  const [invalidCostCategory, setInvalidCostCategory] =
    useState<boolean>(false);

  useEffect(() => {
    setUpdatedCost((prevCost) => ({
      ...prevCost,
      purchaseDate:
        formatDateToYYYYMMDD(updatedPurchaseDate) || prevCost.purchaseDate,
      paymentDeadline:
        formatDateToYYYYMMDD(updatedPaymentDeadline) ||
        prevCost.paymentDeadline,
    }));
  }, [updatedPurchaseDate, updatedPaymentDeadline]);

  async function validateFields() {
    const userId = await localStorage.getItem("portal.id");
    setUpdatedCost({ ...updatedCost, userId: userId || "" });
    setInvalidVendorName(
      !updatedCost.vendorName || updatedCost.vendorName === ""
    );
    setInvalidWorkerValue(
      !updatedCost.workerValue || updatedCost.workerValue === null
    );
    setInvalidMaterialValue(
      !updatedCost.materialValue || updatedCost.materialValue === null
    );
    setInvalidValueRemas(
      !updatedCost.valueRemas || updatedCost.valueRemas === null
    );
    setInvalidPurchaseDate(!updatedPurchaseDate);

    if (
      !invalidPurchaseDate &&
      !invalidVendorName &&
      !invalidWorkerValue &&
      !invalidMaterialValue
    ) {
      onUpdate(updatedCost);
      onHide();
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  useEffect(() => {
    if (updatedCost.workerValue !== null && updatedCost.materialValue) {
      const totalValue = updatedCost.workerValue + updatedCost.materialValue;
      setUpdatedCost((prevCost) => ({
        ...prevCost,
        totalAmount: totalValue || prevCost.totalAmount,
      }));
    }
  }, [updatedCost.workerValue, updatedCost.materialValue]);

  return (
    <Dialog
      header="Editar Custo"
      visible={visible}
      onHide={onHide}
      className="w-60rem"
      style={{ width: "40vw" }}
    >
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Custo"
            htmlFor="purchaseDate"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setUpdatedPurchaseDate(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPurchaseDate}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidPurchaseDate && (
            <Message
              severity="error"
              text="Data de Custo é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Vencimento"
            htmlFor="paymentDeadline"
            className="font-semibold"
          />
          <Calendar
            id="buttondisplay"
            onChange={(e) => {
              setUpdatedPaymentDeadline(e.value || null);
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPaymentDeadline}
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            showIcon
          />
          {invalidPaymentDeadline && (
            <Message
              severity="error"
              text="Data de Vencimento é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Favorecido"
            htmlFor="vendorName"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                vendorName: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.vendorName}
          />
          {invalidVendorName && (
            <Message
              severity="error"
              text="Favorecido é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Categoria"
            htmlFor="costCategory"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                costCategory: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.costCategory}
          />
          {invalidCostCategory && (
            <Message
              severity="error"
              text="Categoria é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Mão de Obra"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedCost?.workerValue)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedCost({
                  ...updatedCost,
                  workerValue: e.value * 100,
                  inssValue: e.value * 100 * 0.11,
                });
              }
            }}
          />
          {invalidWorkerValue && (
            <Message
              severity="error"
              text="Valor Mão de Obra é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Material"
            htmlFor="value"
            className="font-semibold"
          />
          <InputNumber
            inputId="currency-br"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedCost?.materialValue)}
            onChange={(e) => {
              if (e.value) {
                setUpdatedCost({
                  ...updatedCost,
                  materialValue: e.value * 100,
                });
              }
            }}
          />
          {invalidMaterialValue && (
            <Message
              severity="error"
              text="Valor Material é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Confirmação de Pagamento"
            htmlFor="paymentStatus"
            className="font-semibold"
          />
          <div className="flex align-items-center gap-2 w-full a">
            <div className="flex">
              <RadioButton
                value={true}
                name="Sim"
                onChange={(e) =>
                  setUpdatedCost({
                    ...updatedCost,
                    paymentStatus: e.value,
                  })
                }
                checked={updatedCost.paymentStatus === true}
              />
              <label htmlFor="option1" className="ml-2">
                Sim
              </label>
            </div>
            <div className="flex">
              <RadioButton
                value={false}
                name="Não"
                onChange={(e) => {
                  setUpdatedCost({
                    ...updatedCost,
                    paymentStatus: e.value,
                  });
                }}
                checked={updatedCost.paymentStatus === false}
              />
              <label htmlFor="option2" className="ml-2">
                Não
              </label>
            </div>
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Memo"
            htmlFor="additionalDetails"
            className="font-semibold"
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedCost({
                ...updatedCost,
                additionalDetails: e.target.value,
              });
            }}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedCost?.additionalDetails}
          />
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

export default CostUpdateDialog;
