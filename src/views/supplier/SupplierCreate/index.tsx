import LabelTitle from "@/components/LabelTitle";
import { SupplierDTO } from "@/services/supplier/type";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { InputMask } from "primereact/inputmask";
import { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { SupplierContext } from "@/context/SupplierContext";
import { Toast } from "primereact/toast";
import { ToastContext } from "@/context/ToastContext";

function SupplierCreate() {
  const [newSupplier, setNewSupplier] = useState<SupplierDTO>({
    cnpj: "",
    cpf: "",
    completeName: "",
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

  const { handlePostSupplier, postStatus } = useContext(SupplierContext);
  const { showSuccessToast, setShowToast } = useContext(ToastContext);
  const router = useRouter();

  async function validateFields() {
    const resp = await handlePostSupplier(newSupplier);
    if (postStatus === 201) {
      await setShowToast(true);
      await showSuccessToast("Fornecedor criado com sucesso");
    }
    router.push("/fornecedores");
  }

  const toast = useRef<Toast>(null);

  return (
    <Card className="m-3">
      <section className="flex flex-column gap-2 p-5 w-full overflow-y: auto">
        <h1 className="text-xl m-0">Cadastrar Fornecedores</h1>
        <div className="card flex flex-column md:flex-row gap-3 w-full">
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="CNPJ"
              htmlFor="cnpj"
              className="font-semibold text-sm"
            />
            <InputMask
              mask="99.999.999/9999-99"
              placeholder="99.999.999/9999-99"
              onChange={(e) => {
                setNewSupplier({
                  ...newSupplier,
                  cnpj: e.target.value || "",
                });
              }}
              value={newSupplier?.cnpj}
            />
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
                setNewSupplier({
                  ...newSupplier,
                  cpf: e.target.value || "",
                });
              }}
              value={newSupplier?.cpf}
            />
          </div>
          <div className="field flex flex-column gap-2 w-full">
            <LabelTitle
              text="Nome Completo"
              htmlFor="completeName"
              className="font-semibold"
              required={true}
            />
            <InputText
              type="text"
              onChange={(e) => {
                setNewSupplier({
                  ...newSupplier,
                  completeName: e.target.value,
                });
                setInvalidCompleteName(false);
              }}
              value={newSupplier?.completeName}
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
                setNewSupplier({
                  ...newSupplier,
                  shortenedName: e.target.value,
                });
                setInvalidShortenedName(false);
              }}
              value={newSupplier?.shortenedName}
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
                setNewSupplier({
                  ...newSupplier,
                  streetAddress: e.target.value,
                });
                setInvalidStreetAddress(false);
              }}
              value={newSupplier?.streetAddress}
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
                setNewSupplier({
                  ...newSupplier,
                  neighborhood: e.target.value,
                });
                setInvalidNeighborhood(false);
              }}
              value={newSupplier?.neighborhood}
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
                setNewSupplier({
                  ...newSupplier,
                  city: e.target.value,
                });
                setInvalidCity(false);
              }}
              value={newSupplier?.city}
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
                setNewSupplier({
                  ...newSupplier,
                  cep: e.target.value || "",
                });
                setInvalidCep(false);
              }}
              value={newSupplier?.shortenedName}
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
                setNewSupplier({
                  ...newSupplier,
                  sellerName: e.target.value,
                });
                setInvalidSellerName(false);
              }}
              value={newSupplier?.sellerName}
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
                setNewSupplier({
                  ...newSupplier,
                  sellerPhone: e.target.value || "",
                });
                setInvalidSellerPhone(false);
              }}
              value={newSupplier?.sellerPhone}
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
                setNewSupplier({
                  ...newSupplier,
                  sellerEmail: e.target.value,
                });
                setInvalidSellerEmail(false);
              }}
              value={newSupplier?.sellerEmail}
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
                setNewSupplier({
                  ...newSupplier,
                  financialName: e.target.value,
                });
                setInvalidFinancialName(false);
              }}
              value={newSupplier?.financialName}
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
                setNewSupplier({
                  ...newSupplier,
                  financialPhone: e.target.value || "",
                });
                setInvalidFinancialPhone(false);
              }}
              value={newSupplier?.financialPhone}
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
                setNewSupplier({
                  ...newSupplier,
                  financialEmail: e.target.value,
                });
                setInvalidFinancialEmail(false);
              }}
              value={newSupplier?.financialEmail}
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
                setNewSupplier({
                  ...newSupplier,
                  bank1: e.target.value,
                });
                setInvalidBank1(false);
              }}
              value={newSupplier?.bank1}
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
                setNewSupplier({
                  ...newSupplier,
                  bank2: e.target.value,
                });
                setInvalidBank2(false);
              }}
              value={newSupplier?.bank2}
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
                setNewSupplier({
                  ...newSupplier,
                  bank3: e.target.value,
                });
                setInvalidBank3(false);
              }}
              value={newSupplier?.bank3}
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
          <Button
            onClick={() => validateFields()}
            className="rounded-md px-3 font-semibold text-sm"
            label="Salvar"
            severity="danger"
          />
        </div>
        <Toast ref={toast} />
      </section>
    </Card>
  );
}

export default SupplierCreate;
