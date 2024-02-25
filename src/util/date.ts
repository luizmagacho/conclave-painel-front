import format from 'date-fns/format';

function formatJavaLocalDateTimeToReactInputDate(date: any): string {
  return `${date[0]}-${date[1] < 10 ? '0' + date[1] : date[1]}-${date[2]}`;
}

function formatDateToBr(date: string) {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (_) {
    return '';
  }
}

function formatHours(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  const hoursString = () => {
    let final = '';
    if (hours > 0) {
      final = final.concat(hours.toString());
      if (hours == 1) {
        final = final.concat(' hora');
      } else {
        final = final.concat(' horas');
      }
    }
    return final;
  };
  const minutesString = () => {
    let final = '';
    if (minutes > 0) {
      final = final.concat(minutes.toString());
      final = final.concat(' minutos');
    }
    return final;
  };

  return `${hoursString()} ${minutesString()}`;
}

export { formatJavaLocalDateTimeToReactInputDate, formatDateToBr, formatHours };
