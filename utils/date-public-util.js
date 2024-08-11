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

function printDateText(d) {
  if (d !== "") {
    return `${getDayText(d.getDay())} ${d.getDate()} ${getMonthText(
      d.getMonth() + 1
    )} ${d.getFullYear()}`;
  } else {
    return "";
  }
}
