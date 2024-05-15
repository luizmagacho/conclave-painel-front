import LabelTitle from "@/components/LabelTitle";
import { Supplier, SupplierDTO } from "@/services/supplier/type";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { InputMask } from "primereact/inputmask";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { SupplierContext } from "@/context/SupplierContext";
import { Skeleton } from "primereact/skeleton";
import Cookies from "js-cookie";

function SupplierCompleteInfo() {
  const role = Cookies.get("portal.role");
  const { selectedSupplier, handleGetSupplierById, handleUpdateSupplier } =
    useContext(SupplierContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedSupplier, setUpdatedSupplier] = useState<Supplier>({
    id: selectedSupplier?.id || "",
    cnpj: selectedSupplier?.cnpj || "",
    cpf: "",
    completeName: selectedSupplier?.completeName || "",
    shortenedName: "",
    streetAddress: "",
    neighborhood: "",
    city: "",
    cep: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
    financialName: "",
    financialPhone: "",
    financialEmail: "",
    bank1: "",
    bank2: "",
    bank3: "",
    userId: "",
    enabled: true,
    updatedAt: selectedSupplier?.updatedAt || null,
    createdAt: selectedSupplier?.createdAt || null,
  });
  const [invalidCompleteName, setInvalidCompleteName] =
    useState<boolean>(false);
  const [invalidShortenedName, setInvalidShortenedName] =
    useState<boolean>(false);
  const [invalidStreetAddress, setInvalidStreetAddress] =
    useState<boolean>(false);
  const [invalidNeighborhood, setInvalidNeighborhood] =
    useState<boolean>(false);
  const [invalidCity, setInvalidCity] = useState<boolean>(false);
  const [invalidCep, setInvalidCep] = useState<boolean>(false);
  const [invalidSellerName, setInvalidSellerName] = useState<boolean>(false);
  const [invalidSellerPhone, setInvalidSellerPhone] = useState<boolean>(false);
  const [invalidSellerEmail, setInvalidSellerEmail] = useState<boolean>(false);
  const [invalidFinancialName, setInvalidFinancialName] =
    useState<boolean>(false);
  const [invalidFinancialPhone, setInvalidFinancialPhone] =
    useState<boolean>(false);
  const [invalidFinancialEmail, setInvalidFinancialEmail] =
    useState<boolean>(false);
  const [invalidBank1, setInvalidBank1] = useState<boolean>(false);
  const [invalidBank2, setInvalidBank2] = useState<boolean>(false);
  const [invalidBank3, setInvalidBank3] = useState<boolean>(false);

  const [showDisabled, setShowDisabled] = useState<boolean>(true);

  const inputMaskComponent = useRef(null);

  const router = useRouter();

  async function validateFields() {
    await handleUpdateSupplier(updatedSupplier);
    router.push("/fornecedores");
  }

  useEffect(() => {
    const { id } = router.query;
    handleGetSupplierById(typeof id === "string" ? id : "");
  }, []);

  useEffect(() => {
    setLoading(true);

    try {
      setUpdatedSupplier((prevSupplier) => ({
        ...prevSupplier,
        id: selectedSupplier?.id || prevSupplier.id,
        cnpj: selectedSupplier?.cnpj || prevSupplier.cnpj,
        cpf: selectedSupplier?.cpf || prevSupplier.cpf,
        completeName:
          selectedSupplier?.completeName || prevSupplier.completeName,
        shortenedName:
          selectedSupplier?.shortenedName || prevSupplier.shortenedName,
        streetAddress:
          selectedSupplier?.streetAddress || prevSupplier.streetAddress,
        neighborhood:
          selectedSupplier?.neighborhood || prevSupplier.neighborhood,
        city: selectedSupplier?.city || prevSupplier.city,
        cep: selectedSupplier?.cep || prevSupplier.cep,
        sellerName: selectedSupplier?.sellerName || prevSupplier.sellerName,
        sellerEmail: selectedSupplier?.sellerEmail || prevSupplier.sellerEmail,
        sellerPhone: selectedSupplier?.sellerPhone || prevSupplier.sellerPhone,
        financialName:
          selectedSupplier?.financialName || prevSupplier.financialName,
        financialEmail:
          selectedSupplier?.financialEmail || prevSupplier.financialEmail,
        financialPhone:
          selectedSupplier?.financialPhone || prevSupplier.financialPhone,
        bank1: selectedSupplier?.bank1 || prevSupplier.bank1,
        bank2: selectedSupplier?.bank2 || prevSupplier.bank2,
        bank3: selectedSupplier?.bank3 || prevSupplier.bank3,
        userId: selectedSupplier?.userId || prevSupplier.userId,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedSupplier]);

  return (
    <Card className="m-2">
      <section className="flex flex-column gap-2 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="text-xl m-0">Visualizar Fornecedor</h1>
          {role === "Administrador" && (
            <Button
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
              }}
              onClick={() => setShowDisabled(!showDisabled)}
              className="text-sm"
            >
              {" "}
              Editar
            </Button>
          )}
        </div>
        <div className="card flex flex-column md:flex-row gap-2 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="CNPJ"
              htmlFor="cnpj"
              className="font-semibold text-sm"
            />
            {loading && <Skeleton height="2rem" className="mb-2"></Skeleton>}
            {!loading && (
              <InputMask
                mask="99.999.999/9999-99"
                placeholder="99.999.999/9999-99"
                onChange={(e) => {
                  setUpdatedSupplier({
                    ...updatedSupplier,
                    cnpj: e.target.value || "",
                  });
                }}
                value={updatedSupplier?.cnpj}
                disabled={showDisabled}
              />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="CPF"
              htmlFor="cpf"
              className="font-semibold text-sm"
            />
            <InputMask
              mask="999.999.999-99"
              placeholder="999.999.999-99"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  cpf: e.target.value || "",
                });
              }}
              value={updatedSupplier?.cpf}
              disabled={showDisabled}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome Completo"
              htmlFor="completeName"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  completeName: e.target.value,
                });
                setInvalidCompleteName(false);
              }}
              value={updatedSupplier?.completeName}
              disabled={showDisabled}
            />
            {invalidCompleteName && (
              <Message severity="error" text="Nome COmpleto é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome Reduzido"
              htmlFor="shortenedName"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  shortenedName: e.target.value,
                });
                setInvalidShortenedName(false);
              }}
              value={updatedSupplier?.shortenedName}
              disabled={showDisabled}
            />
            {invalidShortenedName && (
              <Message severity="error" text="Nome Reduzido é obrigatório" />
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Logradouro"
              htmlFor="streetAddress"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  streetAddress: e.target.value,
                });
                setInvalidStreetAddress(false);
              }}
              value={updatedSupplier?.streetAddress}
              disabled={showDisabled}
            />
            {invalidStreetAddress && (
              <Message severity="error" text="Logradouro é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Bairro"
              htmlFor="neighborhood"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  neighborhood: e.target.value,
                });
                setInvalidNeighborhood(false);
              }}
              value={updatedSupplier?.neighborhood}
              disabled={showDisabled}
            />
            {invalidNeighborhood && (
              <Message severity="error" text="Bairro é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Cidade"
              htmlFor="city"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  city: e.target.value,
                });
                setInvalidCity(false);
              }}
              value={updatedSupplier?.city}
              disabled={showDisabled}
            />
            {invalidCity && (
              <Message severity="error" text="Cidade é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="CEP"
              htmlFor="cep"
              className="font-semibold text-sm"
              required={true}
            />
            <InputMask
              mask="99.999-999"
              placeholder="99.999-999"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  cep: e.target.value || "",
                });
                setInvalidCep(false);
              }}
              value={updatedSupplier?.shortenedName}
              disabled={showDisabled}
            />
            {invalidCep && (
              <Message severity="error" text="CEP é obrigatório" />
            )}
          </div>
        </div>
        <Divider />
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome Vendedor"
              htmlFor="sellerName"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  sellerName: e.target.value,
                });
                setInvalidSellerName(false);
              }}
              value={updatedSupplier?.sellerName}
              disabled={showDisabled}
            />
            {invalidSellerName && (
              <Message severity="error" text="Nome Vendedor é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Telefone Vendedor"
              htmlFor="sellerPhone"
              className="font-semibold text-sm"
              required={true}
            />
            <InputMask
              mask="(99) 99999999?9"
              placeholder="(99) 99999-9999 ou (99) 9999-9999"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  sellerPhone: e.target.value || "",
                });
                setInvalidSellerPhone(false);
              }}
              value={updatedSupplier?.sellerPhone}
              disabled={showDisabled}
            />
            {invalidSellerPhone && (
              <Message
                severity="error"
                text="Telefone Vendedor é obrigatório"
              />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="E-mail Vendedor"
              htmlFor="sellerEmail"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  sellerEmail: e.target.value,
                });
                setInvalidSellerEmail(false);
              }}
              value={updatedSupplier?.sellerEmail}
              disabled={showDisabled}
            />
            {invalidSellerEmail && (
              <Message severity="error" text="E-mail Vendedor é obrigatório" />
            )}
          </div>
        </div>
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome Financeiro"
              htmlFor="financialName"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  financialName: e.target.value,
                });
                setInvalidFinancialName(false);
              }}
              value={updatedSupplier?.financialName}
              disabled={showDisabled}
            />
            {invalidFinancialName && (
              <Message severity="error" text="Nome Vendedor é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Telefone Vendedor"
              htmlFor="FinancialPhone"
              className="font-semibold text-sm"
              required={true}
            />
            <InputMask
              mask="(99) 99999999?9"
              placeholder="(99) 99999-9999 ou (99) 9999-9999"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  financialPhone: e.target.value || "",
                });
                setInvalidFinancialPhone(false);
              }}
              value={updatedSupplier?.financialPhone}
              disabled={showDisabled}
            />
            {invalidFinancialPhone && (
              <Message
                severity="error"
                text="Telefone Vendedor é obrigatório"
              />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="E-mail Vendedor"
              htmlFor="FinancialEmail"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  financialEmail: e.target.value,
                });
                setInvalidFinancialEmail(false);
              }}
              value={updatedSupplier?.financialEmail}
              disabled={showDisabled}
            />
            {invalidFinancialEmail && (
              <Message severity="error" text="E-mail Vendedor é obrigatório" />
            )}
          </div>
        </div>
        <Divider />
        <div className="card flex flex-column md:flex-row gap-3 w-11/12">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Banco 1"
              htmlFor="bank"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  bank1: e.target.value,
                });
                setInvalidBank1(false);
              }}
              value={updatedSupplier?.bank1}
              disabled={showDisabled}
            />
            {invalidBank1 && (
              <Message severity="error" text="Banco  é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Banco 2"
              htmlFor="bank"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  bank2: e.target.value,
                });
                setInvalidBank2(false);
              }}
              value={updatedSupplier?.bank2}
              disabled={showDisabled}
            />
            {invalidBank2 && (
              <Message severity="error" text="Banco 2 é obrigatório" />
            )}
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Banco 3"
              htmlFor="bank"
              className="font-semibold text-sm"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setUpdatedSupplier({
                  ...updatedSupplier,
                  bank3: e.target.value,
                });
                setInvalidBank3(false);
              }}
              value={updatedSupplier?.bank3}
              disabled={showDisabled}
            />
            {invalidBank3 && (
              <Message severity="error" text="Banco 3 é obrigatório" />
            )}
          </div>
        </div>
        <div
          className="flex justify-end gap-6 w-full"
          style={{ justifyContent: "end" }}
        >
          <Button
            className="font-semibold text-sm"
            label="Cancelar"
            outlined
            onClick={() => {
              router.push("/fornecedores");
            }}
          />
          {!showDisabled && (
            <Button
              onClick={() => validateFields()}
              className="rounded-md px-3 text-sm"
              label="Atualizar"
              severity="danger"
            />
          )}
        </div>
      </section>
    </Card>
  );
}

export default SupplierCompleteInfo;
