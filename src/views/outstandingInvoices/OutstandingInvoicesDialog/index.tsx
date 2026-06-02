import LabelTitle from "@/components/LabelTitle";
import { ConstructionContext } from "@/context/ConstructionContext";
import { OutstandingInvoicesContext } from "@/context/OutstandingInvoiceContext";
import { SupplierContext } from "@/context/SupplierContext";
import { Construction } from "@/services/construction/type";
import { OutstandingInvoices } from "@/services/outstanding-invoices/type";
import { SupplierRecord } from "@/services/supplier/type";
import { convertStringToDate, formatDateToYYYYMMDD } from "@/util/date";
import {
  getInstallmentsByGroupId,
  recalculateInstallments,
} from "@/services/outstanding-invoices";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { RadioButton } from "primereact/radiobutton";
import { SelectButton } from "primereact/selectbutton";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";

interface OutstandingInvoicesDialogProps {
  visible: boolean;
  onHide: () => void;
  onUpdate: (outstandingInvoices: OutstandingInvoices) => void;
  data: OutstandingInvoices;
  onHideAndList?: () => void;
}

function OutstandingInvoicesDialog({
  visible,
  onHide,
  onUpdate,
  data,
  onHideAndList,
}: OutstandingInvoicesDialogProps) {
  const userId = localStorage.getItem("portal.id");
  const toast = useRef<any>(null);

  const [updatedInvoice, setUpdatedInvoice] = useState<OutstandingInvoices>({
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
    paymentStatus: data.paymentStatus,
    totalAmount: data.totalAmount,
    vendorName: data.vendorName,
    userId: data.userId,
    enabled: data.enabled,
    additionalDetails: data.additionalDetails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
    groupId: data.groupId,
    installmentNumber: data.installmentNumber,
    totalInstallments: data.totalInstallments,
  });

  const { allConstructions, handleGetConstructionById, selectedConstruction } =
    useContext(ConstructionContext);
  const { allCategories, handleGetAllCategories } = useContext(OutstandingInvoicesContext);
  const { allSuppliersShortenedName, handleGetAllShortenedName } = useContext(SupplierContext);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord>({
    shortenedName: data.vendorName,
  });
  const [checkedConstruction, setCheckedConstruction] =
    useState<Construction | null>(selectedConstruction);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    data.costCategory
  );
  const [updatedPurchaseDate, setUpdatedPurchaseDate] = useState<Date | null>(
    convertStringToDate(data.purchaseDate)
  );
  const [updatedPaymentDeadline, setUpdatedPaymentDeadline] =
    useState<Date | null>(convertStringToDate(data.paymentDeadline));

  const [groupInstallments, setGroupInstallments] = useState<OutstandingInvoices[]>([]);
  const [loadingGroup, setLoadingGroup] = useState<boolean>(false);

  const paymentModeOptions = [
    { label: "Único", value: "single" },
    { label: "Parcelado", value: "installment" },
  ];
  const [paymentMode, setPaymentMode] = useState<"single" | "installment">(
    data.groupId || data.totalInstallments ? "installment" : "single"
  );
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(data.totalInstallments || 1);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [recalculateLoading, setRecalculateLoading] = useState<boolean>(false);

  // Validation
  const [invalidTotalAmount, setInvalidTotalAmount] = useState<boolean>(false);
  const [invalidPaymentDeadline, setInvalidPaymentDeadline] =
    useState<boolean>(false);
  const [invalidVendorName, setInvalidVendorName] = useState<boolean>(false);
  const [invalidCenterCost, setInvalidCenterCost] = useState<boolean>(false);

  const [constructionItems, setConstructionItems] =
    useState<Construction[]>(allConstructions);
  const [supplierItems, setSupplierItems] = useState<SupplierRecord[]>(
    allSuppliersShortenedName
  );

  useEffect(() => {
    setSupplierItems(allSuppliersShortenedName);
  }, [allSuppliersShortenedName]);

  const [categoryItems, setCategoryItems] = useState<string[]>(allCategories);

  useEffect(() => {
    setCategoryItems(allCategories);
  }, [allCategories]);

  useEffect(() => {
    handleGetConstructionById(data.centerCostId);
    handleGetAllShortenedName();
    handleGetAllCategories();
  }, []);

  // ── Sync dates ────────────────────────────────────────────────────────────
  useEffect(() => {
    setUpdatedInvoice((prev) => ({
      ...prev,
      purchaseDate:
        formatDateToYYYYMMDD(updatedPurchaseDate) || prev.purchaseDate,
      paymentDeadline:
        formatDateToYYYYMMDD(updatedPaymentDeadline) || prev.paymentDeadline,
    }));
  }, [updatedPurchaseDate, updatedPaymentDeadline]);

  // ── Sync construction + category ──────────────────────────────────────────
  useEffect(() => {
    if (checkedConstruction) {
      const isString = typeof checkedConstruction === "string";
      setUpdatedInvoice((prev) => ({
        ...prev,
        centerCostId: isString ? prev.centerCostId : (checkedConstruction.id || prev.centerCostId),
        centerCost: isString ? checkedConstruction : (checkedConstruction.code || prev.centerCost),
        bankBranch: isString ? prev.bankBranch : (checkedConstruction.bankBranch || prev.bankBranch || ""),
        localBank: isString ? prev.localBank : (checkedConstruction.local || prev.localBank || ""),
        costCategory: selectedCategory || prev.costCategory,
      }));
    } else {
      setUpdatedInvoice((prev) => ({
        ...prev,
        centerCostId: "",
        centerCost: "",
        bankBranch: "",
        localBank: "",
        costCategory: selectedCategory || prev.costCategory,
      }));
    }
  }, [checkedConstruction, selectedCategory]);

  useEffect(() => {
    if (allConstructions && allConstructions.length > 0) {
      const found = allConstructions.find((c) => c.id === updatedInvoice.centerCostId);
      if (found) {
        setCheckedConstruction(found);
      }
    }
  }, [allConstructions, updatedInvoice.centerCostId]);

  // ── Sync supplier ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedSupplier) {
      const name = typeof selectedSupplier === "string"
        ? selectedSupplier
        : selectedSupplier.shortenedName;
      setUpdatedInvoice((prev) => ({
        ...prev,
        vendorName: name,
      }));
    } else {
      setUpdatedInvoice((prev) => ({
        ...prev,
        vendorName: "",
      }));
    }
  }, [selectedSupplier]);

  // ── Fetch group installments ──────────────────────────────────────────────
  async function loadGroupInstallments() {
    if (visible && data.groupId) {
      try {
        setLoadingGroup(true);
        const installments = await getInstallmentsByGroupId(data.groupId);
        setGroupInstallments(installments.sort((a, b) => a.installmentNumber! - b.installmentNumber!));
      } catch (error) {
        console.error("Failed to fetch group installments", error);
      } finally {
        setLoadingGroup(false);
      }
    } else {
      setGroupInstallments([]);
    }
  }

  useEffect(() => {
    loadGroupInstallments();
  }, [visible, data.groupId]);

  async function handleRecalculate() {
    setRecalculateLoading(true);
    try {
      if (numberOfInstallments > 0) {
        await recalculateInstallments(
          data.id,
          numberOfInstallments,
          interestRate || 0
        );
        loadGroupInstallments();
        if (onHideAndList) {
          onHideAndList();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRecalculateLoading(false);
    }
  }

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
    const isVendorInvalid =
      !updatedInvoice.vendorName || updatedInvoice.vendorName === "";
    const isAmountInvalid =
      !updatedInvoice.totalAmount || updatedInvoice.totalAmount < 0;
    const isCenterCostInvalid =
      !updatedInvoice.centerCost || updatedInvoice.centerCost === "";

    setInvalidVendorName(isVendorInvalid);
    setInvalidTotalAmount(isAmountInvalid);
    setInvalidCenterCost(isCenterCostInvalid);

    if (isVendorInvalid || isAmountInvalid || isCenterCostInvalid) return;

    onUpdate({ ...updatedInvoice, userId: userId || "" });
    onHide();
  }

  const formatCurrency = (value: number | null) => (value ? value / 100 : 0);

  // ── Installment badge ─────────────────────────────────────────────────────
  const isInstallment =
    data.installmentNumber != null && data.totalInstallments != null;

  const dialogHeader = (
    <div className="flex align-items-center gap-2">
      <i
        className="pi pi-pencil"
        style={{ fontSize: "1.1rem", color: "#e53e3e" }}
      />
      <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
        Editar Conta a Pagar
      </span>
      {isInstallment && (
        <Tag
          value={`Parcela ${updatedInvoice.installmentNumber}/${updatedInvoice.totalInstallments}`}
          severity="danger"
          style={{ fontSize: "0.78rem", marginLeft: "8px" }}
        />
      )}
    </div>
  );

  function handleSelectInstallment(installment: OutstandingInvoices) {
    setUpdatedInvoice(installment);
    setUpdatedPurchaseDate(convertStringToDate(installment.purchaseDate));
    setUpdatedPaymentDeadline(convertStringToDate(installment.paymentDeadline));
    setSelectedCategory(installment.costCategory);
    setSelectedSupplier({ shortenedName: installment.vendorName });
    const foundConstruction = allConstructions.find((c) => c.id === installment.centerCostId);
    setCheckedConstruction(foundConstruction || null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog
      header={dialogHeader}
      visible={visible}
      onHide={onHide}
      style={{ width: "55vw", maxWidth: "900px" }}
      contentStyle={{ padding: "1.25rem 1.5rem" }}
    >
      <Toast ref={toast} />
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
              style={{ height: "30px", fontSize: "0.8rem", maxWidth: "450px" }}
              value={checkedConstruction}
              suggestions={constructionItems}
              completeMethod={constructionSearch}
              onChange={(e: AutoCompleteChangeEvent) => {
                setCheckedConstruction(e.value);
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
            value={updatedInvoice?.localBank}
            disabled
          />
        </div>
      </div>

      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Forma de Pagamento"
            htmlFor="paymentMode"
            className="font-semibold"
          />
          <SelectButton
            id="paymentMode"
            value={paymentMode}
            onChange={(e) => {
              if (e.value) {
                setPaymentMode(e.value);
                if (e.value === "single") {
                  setNumberOfInstallments(1);
                  setInterestRate(null);
                }
              }
            }}
            options={paymentModeOptions}
            className="p-fluid"
            style={{ fontSize: "0.8rem" }}
          />
        </div>

        {paymentMode === "installment" && (
          <>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Número de Parcelas"
                htmlFor="numberOfInstallments"
                className="font-semibold"
              />
              <InputNumber
                id="numberOfInstallments"
                value={numberOfInstallments}
                onValueChange={(e) => setNumberOfInstallments(e.value || 1)}
                min={1}
                max={120}
                style={{ height: "30px", fontSize: "0.8rem" }}
              />
            </div>
            <div className="field flex flex-column gap-2 w-full">
              <LabelTitle
                text="Juros ao Mês (%)"
                htmlFor="interestRate"
                className="font-semibold"
              />
              <InputNumber
                id="interestRate"
                value={interestRate}
                onValueChange={(e) => setInterestRate(e.value || null)}
                min={0}
                max={100}
                maxFractionDigits={2}
                placeholder="Ex: 2,5"
                suffix=" %"
                style={{ height: "30px", fontSize: "0.8rem" }}
              />
            </div>
          </>
        )}
      </div>

      {paymentMode === "installment" && (
        <div className="flex justify-content-end mb-4">
          <Button
            label={data.groupId ? "Recalcular Parcelas Futuras" : "Transformar em Parcelado"}
            icon="pi pi-refresh"
            onClick={handleRecalculate}
            loading={recalculateLoading}
            severity="warning"
            className="w-auto px-4"
          />
        </div>
      )}

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
              field="shortenedName"
              dropdown
              style={{ height: "30px", fontSize: "0.8rem", maxWidth: "450px" }}
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
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Data do Vencimento"
            htmlFor="paymentDeadline"
            className="font-semibold"
          />
          <Calendar
            id="paymentDeadline"
            onChange={(e) => setUpdatedPaymentDeadline(e.value || null)}
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedPaymentDeadline}
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
      </div>

      <div className="card flex flex-column md:flex-row gap-3 w-full">
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle
            text="Valor"
            htmlFor="totalAmount"
            className="font-semibold"
          />
          <InputNumber
            inputId="totalAmount"
            mode="currency"
            locale="pt-BR"
            currency="BRL"
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={formatCurrency(updatedInvoice.totalAmount)}
            onChange={(e) => {
              if (e.value !== null) {
                setUpdatedInvoice({
                  ...updatedInvoice,
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
              style={{ height: "30px", fontSize: "0.8rem", maxWidth: "450px" }}
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
                  setUpdatedInvoice({ ...updatedInvoice, paymentStatus: e.value })
                }
                checked={updatedInvoice.paymentStatus === true}
              />
              <label className="ml-1">Sim</label>
            </div>
            <div className="flex align-items-center gap-1">
              <RadioButton
                value={false}
                name="paymentStatus"
                onChange={(e) =>
                  setUpdatedInvoice({ ...updatedInvoice, paymentStatus: e.value })
                }
                checked={updatedInvoice.paymentStatus === false}
              />
              <label className="ml-1">Não</label>
            </div>
          </div>
        </div>
        <div className="field flex flex-column gap-2 w-full">
          <LabelTitle text="Memo" htmlFor="additionalDetails" className="font-semibold" />
          <InputText
            type="text"
            onChange={(e) =>
              setUpdatedInvoice({
                ...updatedInvoice,
                additionalDetails: e.target.value,
              })
            }
            style={{ height: "30px", fontSize: "0.8rem" }}
            value={updatedInvoice?.additionalDetails}
          />
        </div>
      </div>

      {groupInstallments.length > 0 && (
        <>
          <Divider />
          <div
            className="flex align-items-center gap-2 mb-2"
            style={{ fontSize: "0.8rem", color: "#718096", fontWeight: 600 }}
          >
            <i className="pi pi-list" />
            <span>Outras parcelas deste pagamento</span>
          </div>
          <DataTable
            value={groupInstallments}
            size="small"
            showGridlines
            stripedRows
            scrollable
            scrollHeight="200px"
            style={{ fontSize: "0.78rem", cursor: "pointer" }}
            selectionMode="single"
            selection={updatedInvoice}
            onSelectionChange={(e) => handleSelectInstallment(e.value as OutstandingInvoices)}
            loading={loadingGroup}
            rowClassName={(rowData) =>
              rowData.id === updatedInvoice.id ? { "bg-red-50 text-red-900": true } : {}
            }
          >
            <Column
              field="installmentNumber"
              header="#"
              style={{ width: "50px", textAlign: "center" }}
              body={(row: OutstandingInvoices) => (
                <Tag
                  value={`${row.installmentNumber}/${row.totalInstallments}`}
                  style={{
                    background: row.id === updatedInvoice.id ? "#c53030" : "#e53e3e",
                    fontSize: "0.72rem",
                    padding: "2px 6px",
                  }}
                />
              )}
            />
            <Column field="paymentDeadlineFormatted" header="Vencimento" />
            <Column
              field="totalAmount"
              header="Valor"
              body={(row: OutstandingInvoices) =>
                (row.totalAmount / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <Column
              field="paymentStatus"
              header="Pago?"
              body={(row: OutstandingInvoices) => (
                <Tag
                  value={row.paymentStatus ? "Sim" : "Não"}
                  severity={row.paymentStatus ? "success" : "warning"}
                  style={{ fontSize: "0.7rem", padding: "2px 4px" }}
                />
              )}
            />
          </DataTable>
        </>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex gap-2 mt-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          onClick={validateAndSubmit}
          className="w-full"
          label="Salvar"
          severity="danger"
        />
      </div>
    </Dialog>
  );
}

export default OutstandingInvoicesDialog;
