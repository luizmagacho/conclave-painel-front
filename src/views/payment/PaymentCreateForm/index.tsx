import LabelTitle from "@/components/LabelTitle";
import { PaymentContext } from "@/context/PaymentContext";
import { SupplierContext } from "@/context/SupplierContext";
import {
  Category,
  CategoryDTO,
  PaymentDTO,
  SubCategory,
  SubCategoryDTO,
} from "@/services/payment/type";
import { Supplier, SupplierDTO } from "@/services/supplier/type";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useEffect, useState } from "react";
import CategoryCreateDialog from "../CategoryCreateDialog";
import SubCategoryCreateDialog from "../SubCategoryCreateDialog";
import CurrencyInput from "@/components/InputCurrency";
import SupplierCreate from "@/views/supplier/SupplierCreate";
import { useRouter } from "next/router";
import { ConstructionContext } from "@/context/ConstructionContext";
import { Construction } from "@/services/construction/type";

interface PaymentCreateForm {
  accountId: string;
  accountName: string;
  onCreate: (payment: PaymentDTO) => void;
  paymentType: string;
}

function PaymentCreateForm({
  accountId,
  accountName,
  onCreate,
  paymentType,
}: PaymentCreateForm) {
  const router = useRouter();
  const [newPayment, setNewPayment] = useState<PaymentDTO>({
    centerCost: "",
    centerCostId: "",
    bankBranchLocalBank: "",
    accountId: accountId,
    accountIdTo: null,
    balance: null,
    cleared: false,
    beneficiary: "",
    beneficiaryId: null,
    category: "",
    categoryId: null,
    subCategory: "",
    subCategoryId: null,
    deposit: null,
    withdraw: null,
    transactionType: paymentType,
    enabled: true,
    numberCheckTransfer: "",
    description: "",
    paymentDate: null,
  });
  const [invalidBeneficiary, setInvalidBeneficiary] = useState<boolean>(false);
  const [invalidCategory, setInvalidCategory] = useState<boolean>(false);
  const [invalidSubCategory, setInvalidSubCategory] = useState<boolean>(false);
  const [invalidConstructionCode, setInvalidConstructionCode] =
    useState<boolean>(false);
  const [invalidDate, setInvalidDate] = useState<boolean>(false);
  const [invalidValue, setInvalidValue] = useState<boolean>(false);
  const [selectedConstruction, setSelectedConstruction] =
    useState<Construction>();
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Supplier | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [newPaymentDate, setNewPaymentDate] = useState<Date | null>();

  const { allSuppliers, handleGetAllSuppliers, handlePostSupplier } =
    useContext(SupplierContext);
  const [showCategoryCreateDialog, setShowCategoryCreateDialog] =
    useState<boolean>(false);
  const [showSubCategoryCreateDialog, setShowSubCategoryCreateDialog] =
    useState<boolean>(false);

  const [showSupplierCreateDialog, setShowSupplierCreateDialog] =
    useState<boolean>(false);

  const {
    allCategories,
    allSubCategories,
    handleGetCategories,
    handlePostCategory,
    handleGetSubCategories,
    handlePostSubCategory,
  } = useContext(PaymentContext);

  const [allSupplierItems, setAllSupplierItems] =
    useState<Supplier[]>(allSuppliers);

  const [allCategoriesItems, setAllCategoriesItems] =
    useState<Category[]>(allCategories);

  const [allSubCategoriesItems, setAllSubCategoriesItems] =
    useState<SubCategory[]>(allSubCategories);

  function openCreateCategory() {
    setShowCategoryCreateDialog(true);
  }

  const { allConstructions } = useContext(ConstructionContext);

  const [constructionsItems, setConstructionsItems] =
    useState<Construction[]>(allConstructions);

  useEffect(() => {
    setConstructionsItems(allConstructions);
  }, [allConstructions]);

  const constructionSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredConstructions;
      if (!event.query.trim().length) {
        _filteredConstructions = [...allConstructions];
      } else {
        _filteredConstructions = constructionsItems.filter((construction) => {
          return construction.code.startsWith(event.query);
        });
      }
      setConstructionsItems(_filteredConstructions);
    }, 150);
  };

  async function onCreateCategory(categoryDTO: CategoryDTO) {
    await handlePostCategory(categoryDTO);
    handleGetCategories();
    setAllCategoriesItems(allCategories);
  }

  function closeCreateCategoryDialog() {
    setShowCategoryCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function openCreateSubCategory() {
    setShowSubCategoryCreateDialog(true);
  }

  async function onCreateSubCategory(subCategoryDTO: SubCategoryDTO) {
    await handlePostSubCategory(subCategoryDTO);
    handleGetSubCategories();
    setAllSubCategoriesItems(allSubCategories);
  }

  function closeCreateSubCategoryDialog() {
    setShowSubCategoryCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  function openCreateSupplier() {
    setShowSupplierCreateDialog(true);
  }

  async function onCreateSupplier(supplierDTO: SupplierDTO) {
    await handlePostSupplier(supplierDTO);
    handleGetSubCategories();
    setAllSubCategoriesItems(allSubCategories);
  }

  function closeCreateSupplierDialog() {
    setShowSupplierCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      paymentDate: newPaymentDate || prevPayment.paymentDate,
    }));
  }, [newPaymentDate]);

  const suppliersSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSuppliers;
      if (!event.query.trim().length) {
        _filteredSuppliers = [...allSuppliers];
      } else {
        _filteredSuppliers = allSuppliers.filter((supplier) => {
          return supplier.shortenedName
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllSupplierItems(_filteredSuppliers);
    }, 150);
  };

  const categoriesSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredCategories;
      if (!event.query.trim().length) {
        _filteredCategories = [...allCategories];
      } else {
        _filteredCategories = allCategories.filter((category) => {
          return category.name
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllCategoriesItems(_filteredCategories || []);
    }, 150);
  };

  const subCategoriesSearch = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredSubCategories;
      if (!event.query.trim().length) {
        _filteredSubCategories = [...allSubCategories];
      } else {
        _filteredSubCategories = allSubCategories.filter((subCategory) => {
          return subCategory.name
            .toLocaleUpperCase()
            .startsWith(event.query.toLocaleUpperCase());
        });
      }
      setAllSubCategoriesItems(_filteredSubCategories || []);
    }, 150);
  };

  useEffect(() => {
    handleGetAllSuppliers();
    handleGetCategories();
    handleGetSubCategories();
  }, []);

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      beneficiaryId: selectedBeneficiary?.id || prevPayment.beneficiaryId,
      beneficiary:
        selectedBeneficiary?.shortenedName || prevPayment.beneficiary,
      categoryId: selectedCategory?.id || prevPayment.categoryId,
      category: selectedCategory?.name || prevPayment.category,
      subCategory: selectedSubCategory?.name || prevPayment.subCategory,
      subCategoryId: selectedSubCategory?.id || prevPayment.subCategoryId,
    }));
  }, [selectedBeneficiary, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      centerCostId: selectedConstruction?.id || "",
      centerCost: selectedConstruction?.code || "",
      bankBranchLocalBank: selectedConstruction?.bankBranch
        ? `${selectedConstruction?.bankBranch} - ${selectedConstruction?.local}`
        : "" || "",

      typeCenterCost: selectedConstruction?.service || "",
      payer: selectedConstruction?.client || "",
    }));
  }, [selectedConstruction]);

  async function validateFields() {
    setInvalidBeneficiary(
      !newPayment.beneficiary || newPayment.beneficiary === ""
    );
    setInvalidCategory(!newPayment.category || newPayment.category === "");
    setInvalidSubCategory(
      !newPayment.subCategory || newPayment.subCategory === ""
    );
    setInvalidDate(!newPayment.paymentDate || newPayment.paymentDate === null);
    setInvalidValue(
      !newPayment.withdraw ||
        newPayment.withdraw === null ||
        !newPayment.deposit ||
        newPayment.deposit === null
    );

    if (!invalidBeneficiary || !invalidDate || !invalidValue) {
      await onCreate(newPayment);
      setSelectedBeneficiary(null);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setNewPaymentDate(new Date());
      setNewPayment({
        accountId: accountId,
        accountIdTo: null,
        centerCost: "",
        centerCostId: "",
        bankBranchLocalBank: "",
        balance: null,
        cleared: false,
        beneficiary: "",
        beneficiaryId: null,
        category: "",
        categoryId: null,
        subCategory: "",
        subCategoryId: null,
        deposit: null,
        withdraw: null,
        transactionType: paymentType,
        enabled: true,
        numberCheckTransfer: "",
        description: "",
        paymentDate: new Date(),
      });
    }
  }

  const formatCurrency = (value: number | null) => {
    if (value) {
      return value / 100;
    }

    return null;
  };

  return (
    <div>
      <div>
        <div className="card flex flex-column md:flex-row gap-2 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Código da Obra"
              htmlFor="constructionCode"
              className="font-semibold"
            />
            <div className="card p-fluid">
              <AutoComplete
                type="text"
                field="code"
                dropdown
                value={selectedConstruction}
                suggestions={constructionsItems}
                completeMethod={constructionSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedConstruction(e.value);
                  setInvalidConstructionCode(false);
                }}
                style={{ height: "30px", fontSize: "0.8rem" }}
                forceSelection
              />
              {invalidConstructionCode && (
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
              text="Nome da Obra"
              htmlFor="bankBranchLocalBank"
              className="font-semibold"
            />
            <InputText
              type="text"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={newPayment?.bankBranchLocalBank}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Pagar a:"
            htmlFor="payTo"
            className="font-semibold smaller-text"
          />
          <div className="flex flex-column md:flex-row gap-1 w-11/12">
            <div className="flex flex-column gap-1 w-full">
              <AutoComplete
                suggestions={allSupplierItems}
                field="shortenedName"
                dropdown
                style={{ height: "30px", fontSize: "0.75rem" }}
                value={selectedBeneficiary}
                completeMethod={suppliersSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedBeneficiary(e.value);

                  setInvalidBeneficiary(false);
                }}
              />
            </div>
            <div className="flex flex-column gap-1">
              <Button
                severity="danger"
                style={{ height: "30px", fontSize: "0.8rem" }}
                icon="pi pi-plus" // PrimeReact's "+" icon class
                className="rounded-md px-3 smaller-text" // Optional styling
                onClick={() => {
                  router.push(`/fornecedores/cadastrar`);
                }}
              />
            </div>
          </div>
          {invalidBeneficiary && (
            <Message
              severity="error"
              text="Favorecido é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Número"
            htmlFor="number"
            className="font-semibold smaller-text"
          />
          <InputText
            type="number"
            style={{ height: "30px", fontSize: "0.75rem" }}
            onChange={(e) => {
              setNewPayment({
                ...newPayment,
                numberCheckTransfer: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Categoria:"
            htmlFor="payTo"
            className="font-semibold smaller-text"
          />
          <div className="flex flex-column md:flex-row gap-1 w-11/12">
            <div className="flex flex-column gap-1 w-full">
              <AutoComplete
                suggestions={allCategoriesItems}
                field="name"
                dropdown
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={selectedCategory}
                completeMethod={categoriesSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedCategory(e.value);

                  setInvalidCategory(false);
                }}
              />
            </div>
            <div className="flex flex-column gap-1">
              <Button
                severity="danger"
                style={{ height: "30px", fontSize: "0.8rem" }}
                icon="pi pi-plus" // PrimeReact's "+" icon class
                className="rounded-md px-3 smaller-text" // Optional styling
                onClick={openCreateCategory}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Data"
            htmlFor="paymentDate"
            className="font-semibold smaller-text"
          />
          <Calendar
            locale="pt"
            className="ui-state-default"
            dateFormat="dd/mm/yy"
            style={{ height: "30px", fontSize: "0.8rem" }}
            showIcon
            onChange={(e) => {
              setNewPaymentDate(e.value || null);
            }}
          />
          {invalidDate && (
            <Message
              severity="error"
              text="Data é obrigatória"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="card flex flex-column md:flex-row gap-2 w-11/12">
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="SubCategoria:"
            htmlFor="payTo"
            className="font-semibold smaller-text"
          />
          <div className="flex flex-column md:flex-row gap-1 w-11/12">
            <div className="flex flex-column gap-1 w-full">
              <AutoComplete
                suggestions={allSubCategoriesItems}
                field="name"
                dropdown
                style={{ height: "30px", fontSize: "0.8rem" }}
                value={selectedSubCategory}
                completeMethod={subCategoriesSearch}
                onChange={(e: AutoCompleteChangeEvent) => {
                  setSelectedSubCategory(e.value);

                  setInvalidSubCategory(false);
                }}
              />
            </div>
            <div className="flex flex-column gap-1">
              <Button
                severity="danger"
                style={{ height: "30px", fontSize: "0.8rem" }}
                icon="pi pi-plus" // PrimeReact's "+" icon class
                className="rounded-md px-3 smaller-text" // Optional styling
                onClick={openCreateSubCategory}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-column gap-1 w-full">
          <LabelTitle
            text="Montante"
            htmlFor="withdraw"
            className="font-semibold smaller-text"
          />
          {paymentType === "WITHDRAW" && (
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={formatCurrency(newPayment?.withdraw)}
              onChange={(e) => {
                if (e.value) {
                  setNewPayment({ ...newPayment, withdraw: e.value * 100 });
                }
              }}
            />
          )}
          {paymentType === "MONEYWITHDRAW" && (
            <InputNumber
              inputId="currency-br"
              mode="currency"
              locale="pt-BR"
              currency="BRL"
              style={{ height: "30px", fontSize: "0.8rem" }}
              value={formatCurrency(newPayment?.withdraw)}
              onChange={(e) => {
                if (e.value) {
                  setNewPayment({ ...newPayment, withdraw: e.value * 100 });
                }
              }}
            />
          )}
          {paymentType === "DEPOSIT" && (
            <>
              {/* <CurrencyInput
                  onChange={(e) => {
                    setNewPayment({ ...newPayment, deposit: e });
                  }}
                /> */}
              <InputNumber
                inputId="currency-br"
                mode="currency"
                locale="pt-BR"
                currency="BRL"
                style={{ height: "30px", fontSize: "0.8rem" }}
                className="smaller-text"
                value={formatCurrency(newPayment?.deposit)}
                onChange={(e) => {
                  if (e.value) {
                    setNewPayment({ ...newPayment, deposit: e.value * 100 });
                  }
                }}
              />
            </>
          )}
          {invalidValue && (
            <Message
              severity="error"
              text="Montante é obrigatório"
              className="smaller-text"
            />
          )}
        </div>
      </div>
      <div className="field flex flex-column gap-1 w-full">
        <LabelTitle
          text="Memo: "
          htmlFor="memo"
          className="font-semibold smaller-text"
        />
        <InputText
          type="text"
          className="flex-grow smaller-text"
          value={newPayment.description}
          onChange={(e) => {
            setNewPayment({ ...newPayment, description: e.target.value });
          }}
        />
      </div>
      <div
        className="flex justify-end gap-6 w-full"
        style={{ justifyContent: "end" }}
      >
        <Button
          className="rounded-md px-3 smaller-text"
          label={
            paymentType === "WITHDRAW"
              ? "Retirar"
              : paymentType === "DEPOSIT"
              ? "Depositar"
              : paymentType === "MONEYWITHDRAW"
              ? "Retirada em Dinheiro"
              : "Transferência"
          }
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
      {showCategoryCreateDialog && (
        <CategoryCreateDialog
          visible={showCategoryCreateDialog}
          onCreate={onCreateCategory}
          onHide={closeCreateCategoryDialog}
        />
      )}
      {showSubCategoryCreateDialog && (
        <SubCategoryCreateDialog
          visible={showSubCategoryCreateDialog}
          onCreate={onCreateSubCategory}
          onHide={closeCreateSubCategoryDialog}
        />
      )}
      {showSupplierCreateDialog && <SupplierCreate />}
    </div>
  );
}

export default PaymentCreateForm;
