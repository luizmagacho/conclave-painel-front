import { AccountContext } from "@/context/AccountContext";
import { PaymentContext } from "@/context/PaymentContext";
import { Payment } from "@/services/payment/type";
import { useContext, useState } from "react";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onClick: (payment: Payment) => void;
}

interface OptionType {
  type: string[];
}

const columns = [
  {
    field: "numberCheckTransfer",
    header: "Número",
  },
  {
    field: "paymentDate",
    header: "Data",
  },
  {
    field: "beneficiary",
    header: "Favorecido",
  },
  {
    field: "cleared",
    header: "C",
  },
  {
    field: "withdraw",
    header: "Pagamento",
  },
  {
    field: "deposit",
    header: "Depósito",
  },
  {
    field: "balance",
    header: "Saldo",
  },
];

function PaymentList() {
  const [currPayment, setCurrPayment] = useState<Payment | null>(null);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: ["Data", "Favorecido"],
  });

  const { accountsList } = useContext(AccountContext);

  const {} = useContext(PaymentContext);

  return <></>;
}

export default PaymentList;
