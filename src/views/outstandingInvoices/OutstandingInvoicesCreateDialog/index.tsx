import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { OutstandingInvoicesDTO } from "@/services/outstanding-invoices/type";
import { SupplierRecord } from "@/services/supplier/type";
import { formatDateToYYYYMMDD } from "@/util/date";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { SelectButton } from "primereact/selectbutton";
import { Tag } from "primereact/tag";
import { useContext, useEffect, useMemo, useState } from "react";

interface OutstandingInvoicesCreateDialogProps {
  visible: boolean;
  onHide: () => void;
  onCreate: (outstandingInvoices: OutstandingInvoicesDTO) => void;
}

type PaymentMode = "single" | "installments";

interface InstallmentPreviewRow {
  installmentNumber: number;
  dueDate: string;
  amount: string;
  amountRaw: number;
}

function OutstandingInvoicesCreateDialog({
  visible,
  onCreate,
  onHide,
}: OutstandingInvoicesCreateDialogProps) {
  const userId = localStorage.getItem("portal.id");

  const [newInvoice, setNewInvoice] = useState<OutstandingInvoicesDTO>({
    name: "",
    vendorName: "",
    centerCost: "",
    centerCostId: "",
    bankBranch: "",
    costType: "",
    costCategory: "FORNECEDOR : MATERIAIS",
    localBank: "",
    purchaseDate: "",
    paymentDeadline: "",
    totalAmount: 0,
    userId: localStorage.getItem("portal.id") as string,
    enabled: true,
    additionalDetails: "",
    paymentStatus: false,
  });

  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "FORNECEDOR : MATERIAIS"
  );
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord>();
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [paymentDeadline, setPaymentDeadline] = useState<Date | null>(null);

  // Installment state
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("single");
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(2);
  const [firstInstallmentDueDate, setFirstInstallmentDueDate] =
    useState<Date | null>(null);

  // Validation
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidTotalAmount, setInvalidTotalAmount] = useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);
  const [invalidInstallmentDate, setInvalidInstallmentDate] =
    useState<boolean>(false);

  const { allConstructions } = useContext(ConstructionContext);
  const { allSuppliersShortenedName, handleGetAllShortenedName } =
    useContext(SupplierContext);
  const {
    allCategories,
    handleGetAllCategories,
    latestAdditionalDetails,
    handleGetLatestAdditionalDetails,
  } = useContext(OutstandingInvoicesContext);

  const [constructionItems, setConstructionItems] =
    useState<Construction[]>(allConstructions);
  const [supplierItems, setSupplierItems] = useState<SupplierRecord[]>(
    allSuppliersShortenedName
  );
  const [categoryItems, setCategoryItems] = useState<string[]>(allCategories);

  const paymentModeOptions = [
    { label: "À vista", value: "single" },
    { label: "Parcelado", value: "installments" },
  ];

  // ── Sync dates into the invoice DTO ───────────────────────────────────────
  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      purchaseDate:
        formatDateToYYYYMMDD(purchaseDate) || prev.purchaseDate,
      paymentDeadline:
        formatDateToYYYYMMDD(paymentDeadline) || prev.paymentDeadline,
    }));
  }, [purchaseDate, paymentDeadline]);

  // ── Sync selected construction into invoice DTO ───────────────────────────
  useEffect(() => {
    if (selectedConstruction) {
      const isString = typeof selectedConstruction === "string";
      setNewInvoice((prev) => ({
        ...prev,
        centerCostId: isString ? prev.centerCostId : (selectedConstruction.id || prev.centerCostId),
        centerCost: isString ? selectedConstruction : (selectedConstruction.code || prev.centerCost),
        bankBranch: isString ? prev.bankBranch : (selectedConstruction.bankBranch || prev.bankBranch || ""),
        localBank: isString ? prev.localBank : (selectedConstruction.local || prev.localBank || ""),
        costCategory: selectedCategory || prev.costCategory,
      }));
    } else {
      setNewInvoice((prev) => ({
        ...prev,
        centerCostId: "",
        centerCost: "",
        bankBranch: "",
        localBank: "",
        costCategory: selectedCategory || prev.costCategory,
      }));
    }
  }, [selectedConstruction, selectedCategory]);

  // ── Sync selected supplier into invoice DTO ───────────────────────────────
  useEffect(() => {
    if (selectedSupplier) {
      const isString = typeof selectedSupplier === "string";
      const name = isString ? selectedSupplier : selectedSupplier.shortenedName;
      if (!isString && selectedSupplier.shortenedName) {
        handleGetLatestAdditionalDetails(selectedSupplier.shortenedName);
      }
      setNewInvoice((prev) => ({
        ...prev,
        vendorName: name || "",
      }));
    } else {
      setNewInvoice((prev) => ({
        ...prev,
        vendorName: "",
      }));
    }
  }, [selectedSupplier]);

  useEffect(() => {
    if (newInvoice.vendorName) {
      setNewInvoice((prev) => ({
        ...prev,
        additionalDetails: latestAdditionalDetails,
      }));
    }
  }, [latestAdditionalDetails]);

  // ── Installment preview rows ──────────────────────────────────────────────
  const installmentPreviewRows = useMemo<InstallmentPreviewRow[]>(() => {
    if (
      paymentMode !== "installments" ||
      !firstInstallmentDueDate ||
      numberOfInstallments < 2 ||
      !newInvoice.totalAmount
    ) {
      return [];
    }

    const totalCents = newInvoice.totalAmount;
    const perInstallmentCents = Math.floor(totalCents / numberOfInstallments);
    const remainder = totalCents % numberOfInstallments;

    return Array.from({ length: numberOfInstallments }, (_, i) => {
      const installmentNumber = i + 1;
      const amountCents =
        installmentNumber === numberOfInstallments
          ? perInstallmentCents + remainder
          : perInstallmentCents;
      const dueDate = new Date(firstInstallmentDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      return {
        installmentNumber,
        dueDate: dueDate.toLocaleDateString("pt-BR"),
        amount: (amountCents / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        amountRaw: amountCents,
      };
    });
  }, [
    paymentMode,
    firstInstallmentDueDate,
    numberOfInstallments,
    newInvoice.totalAmount,
  ]);

  // ── AutoComplete search handlers ──────────────────────────────────────────
  const constructionSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      const filtered = !event.query.trim().length
        ? [...allConstructions]
        : allConstructions.filter((c) => c.code.startsWith(event.query));
      setConstructionItems(filtered);
    }, 150);
  };

  const supplierSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      const filtered = !event.query.trim().length
        ? [...allSuppliersShortenedName]
        : allSuppliersShortenedName.filter((s) =>
            s.shortenedName
              .toLocaleUpperCase()
              .startsWith(event.query.toLocaleUpperCase())
          );
      setSupplierItems(filtered);
    }, 150);
  };

  const categorySearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      const filtered = !event.query.trim().length
        ? [...allCategories]
        : allCategories.filter((c) =>
            c.toLocaleUpperCase().startsWith(event.query.toLocaleUpperCase())
          );
      setCategoryItems(filtered);
    }, 150);
  };

  // ── Validation & submit ───────────────────────────────────────────────────
  function validateAndSubmit() {
    const isVendorInvalid = !newInvoice.vendorName;
    const isAmountInvalid = !newInvoice.totalAmount || newInvoice.totalAmount <= 0;
    const isCenterCostInvalid = !newInvoice.centerCost;
    const isDeadlineInvalid =
      paymentMode === "single" && !newInvoice.paymentDeadline;
    const isInstallmentDateInvalid =
      paymentMode === "installments" && !firstInstallmentDueDate;

    setInvalidVendorName(isVendorInvalid);
    setInvalidTotalAmount(isAmountInvalid);
    setInvalidCenterCost(isCenterCostInvalid);
    setInvalidPaymentDeadline(isDeadlineInvalid);
    setInvalidInstallmentDate(isInstallmentDateInvalid);

    if (
      isVendorInvalid ||
      isAmountInvalid ||
      isCenterCostInvalid ||
      isDeadlineInvalid ||
      isInstallmentDateInvalid
    ) {
      return;
    }

    const invoicePayload: OutstandingInvoicesDTO = {
      ...newInvoice,
      userId: userId || "",
      totalAmount: newInvoice.totalAmount,
    };

    if (paymentMode === "installments") {
      invoicePayload.paymentDeadline =
        formatDateToYYYYMMDD(firstInstallmentDueDate) || "";
      invoicePayload.numberOfInstallments = numberOfInstallments;
    } else {
      invoicePayload.numberOfInstallments = 1;
    }

    onCreate(invoicePayload);
    onHide();
  }

  const formatCurrency = (value: number) => (value ? value / 100 : 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog
      header={
        <div className="flex align-items-center gap-2">
          <i
            className="pi pi-file-plus"
            style={{ fontSize: "1.2rem", color: "#e53e3e" }}
          />
          <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            Nova Conta a Pagar
          </span>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: "55vw", maxWidth: "900px" }}
      contentStyle={{ padding: "1.25rem 1.5rem" }}
    >
      {/* ── Row 1: Construction + Local Bank ── */}
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Obra"
            htmlFor="centerCost"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              field="code"
              dropdown
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedConstruction}
              suggestions={constructionItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setSelectedConstruction(e.value);
                setInvalidCenterCost(false);
              }}
            />
            {invalidCenterCost && (
              <Message
                severity="error"
                text="Obra é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Local da Agência"
            htmlFor="localBank"
            className="font-semibold"
          />
          <InputText
            type="text"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newInvoice?.localBank}
            disabled
          />
        </div>
      </div>

      {/* ── Row 2: Vendor + Payment Deadline ── */}
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Favorecido"
            htmlFor="vendorName"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              field="shortenedName"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedSupplier}
              suggestions={supplierItems}
              completeMethod={supplierSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setSelectedSupplier(e.value);
                setInvalidVendorName(false);
              }}
            />
            {invalidVendorName && (
              <Message
                severity="error"
                text="Favorecido é obrigatório"
                className="smaller-text"
              />
            )}
          </div>
        </div>
        {paymentMode === "single" && (
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Data do Vencimento"
              htmlFor="paymentDeadline"
              className="font-semibold"
            />
            <Calendar
              id="paymentDeadline"
              onChange={(e) => setPaymentDeadline(e.value || null)}
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={paymentDeadline}
              locale="pt"
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
        )}
      </div>

      {/* ── Row 3: Total Amount + Category ── */}
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor Total"
            htmlFor="totalAmount"
            className="font-semibold"
          />
          <InputNumber
            inputId="totalAmount"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(newInvoice.totalAmount)}
            onChange={(e) => {
              if (e.value !== null) {
                setNewInvoice({
                  ...newInvoice,
                  totalAmount: Math.round(e.value * 100),
                });
                setInvalidTotalAmount(false);
              }
            }}
          />
          {invalidTotalAmount && (
            <Message
              severity="error"
              text="Valor é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Categoria"
            htmlFor="category"
            className="font-semibold"
          />
          <div className="card p-fluid">
            <AutoComplete
              type="text"
              dropdown
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={selectedCategory}
              suggestions={categoryItems}
              completeMethod={categorySearch}
              onChange={(e: AutoCompleteChangeEvent) =>
                setSelectedCategory(e.value)
              }
            />
          </div>
        </div>
      </div>

      {/* ── Installments Section ── */}
      <Divider />
      <div
        style={{
          background: "linear-gradient(135deg, #fff5f5 0%, #fff 100%)",
          border: "1px solid #fed7d7",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
        }}
      >
        <div className="flex align-items-center gap-2 mb-3">
          <i
            className="pi pi-credit-card"
            style={{ color: "#e53e3e", fontSize: "1rem" }}
          />
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#c53030" }}>
            Forma de Pagamento
          </span>
        </div>

        <div className="flex align-items-center gap-3 mb-3">
          <SelectButton
            value={paymentMode}
            onChange={(e) => {
              setPaymentMode(e.value as PaymentMode);
              setInvalidInstallmentDate(false);
              setInvalidPaymentDeadline(false);
            }}
            options={paymentModeOptions}
            style={{ fontSize: "0.85rem" }}
          />
          {paymentMode === "installments" && (
            <Tag
              value={`${numberOfInstallments}x de ${
                newInvoice.totalAmount
                  ? (
                      Math.floor(newInvoice.totalAmount / numberOfInstallments) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ 0,00"
              }`}
              severity="danger"
              style={{ fontSize: "0.85rem" }}
            />
          )}
        </div>

        {paymentMode === "installments" && (
          <>
            <div className="flex flex-column md:flex-row gap-3">
              <div className="field flex flex-column gap-2" style={{ minWidth: "180px" }}>
                <LabelTitle
                  text="Número de Parcelas"
                  htmlFor="numberOfInstallments"
                  className="font-semibold"
                />
                <InputNumber
                  inputId="numberOfInstallments"
                  value={numberOfInstallments}
                  min={2}
                  max={120}
                  showButtons
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  onChange={(e) =>
                    setNumberOfInstallments(Math.max(2, e.value ?? 2))
                  }
                />
              </div>
              <div className="field flex flex-column gap-2">
                <LabelTitle
                  text="Data da 1ª Parcela"
                  htmlFor="firstInstallmentDueDate"
                  className="font-semibold"
                />
                <Calendar
                  id="firstInstallmentDueDate"
                  value={firstInstallmentDueDate}
                  onChange={(e) => {
                    setFirstInstallmentDueDate(e.value || null);
                    setInvalidInstallmentDate(false);
                  }}
                  style={{ height: "30px", fontSize: "0.8rem" }}
                  locale="pt"
                  dateFormat="dd/mm/yy"
                  showIcon
                />
                {invalidInstallmentDate && (
                  <Message
                    severity="error"
                    text="Data da 1ª parcela é obrigatória"
                    className="smaller-text"
                  />
                )}
              </div>
            </div>

            {/* ── Installment Preview Table ── */}
            {installmentPreviewRows.length > 0 && (
              <div className="mt-3">
                <div
                  className="flex align-items-center gap-2 mb-2"
                  style={{ fontSize: "0.8rem", color: "#718096", fontWeight: 600 }}
                >
                  <i className="pi pi-calendar-times" />
                  <span>Prévia das parcelas</span>
                </div>
                <DataTable
                  value={installmentPreviewRows}
                  size="small"
                  showGridlines
                  stripedRows
                  scrollable
                  scrollHeight="200px"
                  style={{ fontSize: "0.78rem" }}
                >
                  <Column
                    field="installmentNumber"
                    header="#"
                    style={{ width: "50px", textAlign: "center" }}
                    body={(row: InstallmentPreviewRow) => (
                      <Tag
                        value={`${row.installmentNumber}/${numberOfInstallments}`}
                        style={{
                          background: "#e53e3e",
                          fontSize: "0.72rem",
                          padding: "2px 6px",
                        }}
                      />
                    )}
                  />
                  <Column field="dueDate" header="Vencimento" />
                  <Column field="amount" header="Valor" />
                </DataTable>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Row 4: Payment Status + Memo ── */}
      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Confirmação de Pagamento"
            htmlFor="paymentStatus"
            className="font-semibold"
          />
          <div className="flex align-items-center gap-3">
            <div className="flex align-items-center gap-1">
              <RadioButton
                value={true}
                name="paymentStatus"
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, paymentStatus: e.value })
                }
                checked={newInvoice.paymentStatus === true}
              />
              <label className="ml-1">Sim</label>
            </div>
            <div className="flex align-items-center gap-1">
              <RadioButton
                value={false}
                name="paymentStatus"
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, paymentStatus: e.value })
                }
                checked={newInvoice.paymentStatus === false}
              />
              <label className="ml-1">Não</label>
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
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, additionalDetails: e.target.value })
            }
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={newInvoice?.additionalDetails}
          />
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex gap-2 mt-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          onClick={validateAndSubmit}
          className="w-full"
          label={
            paymentMode === "installments"
              ? `Salvar ${numberOfInstallments} Parcelas`
              : "Salvar"
          }
          severity="danger"
        />
      </div>
    </Dialog>
  );
}

export default OutstandingInvoicesCreateDialog;
