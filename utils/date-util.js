// date
function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getDateTextFromLocalDate(d) {
  return `${formatNumberToText(d.getDate())}/${formatNumberToText(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
}

function getLessonDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function toDateInput(dateValue) {
  const [day, month, year] = dateValue.split("/");
  return `${year}-${month}-${day}`;
}

function textDateToInput(d) {
  return `${formatNumberToText(d.getFullYear())}-${formatNumberToText(
    d.getMonth() + 1
  )}-${formatNumberToText(d.getDate())}`;
}

function printDateFull(d) {
  if (d !== "") {
    return `${printWeekDay(d)} ${printDate(d)} ${d.getFullYear()}`;
  } else {
    return "";
  }
}

function printWeekDay(d) {
  if (d !== "") {
    return `${getDayText(d.getDay())}`;
  } else {
    return "";
  }
}

function printDate(d) {
  if (d !== "") {
    return `${d.getDate()} ${getMonthText(d.getMonth() + 1)}`;
  } else {
    return "";
  }
}

function formatNumberToText(number) {
  if (number === 0) {
    return "00";
  }
  return number < 10 ? `0${number}` : number;
}

function getNextMonday() {
  const date = new Date();
  const currentDay = date.getDay();
  const daysUntilNextMonday = (8 - currentDay) % 7;
  const nextMonday = new Date(date);
  nextMonday.setDate(date.getDate() + daysUntilNextMonday);
  return textDateToInput(nextMonday);
}

function getDayText(number) {
  switch (number) {
    case 1:
      return "Lundi";
    case 2:
      return "Mardi";
    case 3:
      return "Mercredi";
    case 4:
      return "Jeudi";
    case 5:
      return "Vendredi";
    case 6:
      return "Samedi";
    default:
      return "Dimanche";
  }
}

function getMonthText(month) {
  switch (month) {
    case 1:
      return "Janv.";
    case 2:
      return "Févr.";
    case 3:
      return "Mars";
    case 4:
      return "Avr.";
    case 5:
      return "Mai";
    case 6:
      return "Juin";
    case 7:
      return "Juill.";
    case 8:
      return "Août";
    case 9:
      return "Sept.";
    case 10:
      return "Oct.";
    case 11:
      return "Nov.";
    case 12:
      return "Déc.";
    default:
      return "";
  }
}

function getDayNumber(dayText) {
  return [0, 1, 2, 3, 4, 5, 6, 7].find(
    (n) =>
      getDayText(n).trim().toLocaleLowerCase() ===
      dayText.trim().toLocaleLowerCase()
  );
}
