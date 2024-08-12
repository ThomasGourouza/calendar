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

function getDayText(day) {
  switch (day) {
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
    case 7:
      return "Dimanche";
    default:
      return "";
  }
}

function getMonthText(month) {
  switch (month) {
    case 1:
      return "Janvier";
    case 2:
      return "Février";
    case 3:
      return "Mars";
    case 4:
      return "Avril";
    case 5:
      return "Mai";
    case 6:
      return "Juin";
    case 7:
      return "Juillet";
    case 8:
      return "Août";
    case 9:
      return "Septembre";
    case 10:
      return "Octobre";
    case 11:
      return "Novembre";
    case 12:
      return "Décembre";
    default:
      return "";
  }
}
