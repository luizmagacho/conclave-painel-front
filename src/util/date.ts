import { addLocale } from "primereact/api";

export function convertStringToDate(dateString: string): Date | null {
  if (!dateString) {
    return null; // Retorna null se a string estiver vazia
  }

  // O construtor Date já entende o formato ISO 8601
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return null; // Retorna null se a data for inválida
  }

  return date;
}

export function convertOrderTimeToDate(timeString: string): Date {
  // Validação básica para garantir que a string esteja no formato correto
  const timeRegex = /^([0-9]{2}):([0-9]{2})$/;
  if (!timeRegex.test(timeString)) {
    throw new Error("Formato de hora inválido. Use HH:MM");
  }

  // Separa as horas e minutos da string
  const [hours, minutes] = timeString.split(":").map(Number);

  // Cria um novo objeto Date com a data atual e as horas e minutos especificados
  const currentDate = new Date();
  const timeDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes
  );

  return timeDate;
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

export function formatDateToHHMM(date: Date | null): string | null {
  if (date === null) {
    return null; // Retorna null se a data for null
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function parseHHMMToDate(timeString: string): Date | null {
  if (!timeString) {
    return null; // Return null if the time string is empty or undefined
  }

  const [hours, minutes] = timeString.split(":");

  if (
    hours === undefined ||
    minutes === undefined ||
    hours.length !== 2 ||
    minutes.length !== 2
  ) {
    return null; // Invalid time format
  }

  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  if (
    isNaN(parsedHours) ||
    isNaN(parsedMinutes) ||
    parsedHours < 0 ||
    parsedHours > 23 ||
    parsedMinutes < 0 ||
    parsedMinutes > 59
  ) {
    return null; // Invalid hour or minute values
  }

  const date = new Date();
  date.setHours(parsedHours);
  date.setMinutes(parsedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
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
    "",
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

export function getPreviousYears(): number[] {
  const currentYear = new Date().getFullYear();
  const previousYears = new Date().getFullYear() - 50;
  const years: number[] = [];

  for (let year = currentYear; year >= previousYears; year--) {
    years.push(year);
  }

  return years;
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

export function formatarDataBR(data: Date): string {
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}
