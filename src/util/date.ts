import { addLocale } from "primereact/api";

export function convertStringToDate(dateString: string): Date | null {
  if (!dateString) {
    return null; // Retorna null se a string estiver vazia
  }

  const dateParts = dateString.split("-");

  if (dateParts.length !== 3) {
    return null; // Retorna null se o formato estiver incorreto
  }

  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[2]);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    return null; // Retorna null se a data for inválida
  }

  return date;
}

export function formatDateToYYYYMMDD(date: Date | null): string | null {
  if (date === null) {
    return null; // Retorna null se a data for null
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const localeBR = addLocale("pt", {
  firstDayOfWeek: 1,
  dayNames: [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
  ],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  monthNames: [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  today: "Hoje",
  clear: "Limpar",
});

export function getMonthNames(numberOfMonth: number): string {
  const months: string[] = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return months[numberOfMonth];
}

export function getMonthsNames(): string[] {
  return [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
}

export function getMonthInPortuguese(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    return ""; // ou outra lógica para tratar valor nulo ou vazio
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    timeZone: "America/Sao_Paulo",
  }; // Ajuste o fuso horário conforme necessário

  return date.toLocaleDateString("pt-BR", options);
}

export function formatarData(dataString: string): string {
  const ano = Number(dataString.toString().slice(0, 4));
  const mes = Number(dataString.toString().slice(5, 7));
  const dia = Number(dataString.toString().slice(8, 9));
  const hora = 0;
  const minuto = 0;
  const dataOriginal = new Date(ano, mes, dia, hora, minuto);

  const adicionarZero = (numero: number) =>
    numero < 10 ? `0${numero}` : numero;
  const dataFormatada = `${dataOriginal.getFullYear()}-${adicionarZero(
    dataOriginal.getMonth() + 1
  )}-${adicionarZero(dataOriginal.getDate())}T${adicionarZero(
    dataOriginal.getHours()
  )}:${adicionarZero(dataOriginal.getMinutes())}:00.000Z`;
  return dataFormatada;
}
