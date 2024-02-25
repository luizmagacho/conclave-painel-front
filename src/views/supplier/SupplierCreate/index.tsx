import { SupplierDTO } from "@/services/supplier/type";
import { Card } from "primereact/card";
import { useState } from "react";

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
  const [invalidCnpj, setInvalidCnpj] = useState<boolean>(false);
  const [invalidCpf, setInvalidCpf] = useState<boolean>(false);
  const [invalidCompleteName, setInvalidCompleteName] =
    useState<boolean>(false);
  const [invalidShortenedName, setInvalidShortenedName] =
    useState<boolean>(false);
  const [invalidStreetAddress, setInvalidStreetAddress] =
    useState<boolean>(false);
  const [invalidNeighborhood, setInvalidNeighborhood] =
    useState<boolean>(false);
  const [invalidCity, setInvalidCity] = useState<boolean>(false);
  const [invalidSellerName, setInvalidSellerName] = useState<boolean>(false);
  const [invalidSellerPhone, setInvalidSellerPhone] = useState<boolean>(false);

  return (
    <div className="card">
      <Card title="Informações"></Card>
    </div>
  );
}
