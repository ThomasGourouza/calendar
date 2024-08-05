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

function printDateText(d, lang) {
  return `${getDayText(d.getDay(), lang)} ${d.getDate()} ${getMonthText(
    d.getMonth() + 1,
    lang
  )} ${d.getFullYear()}`;
}

// time
function getTimeTextFrom(quarterTimeId, minTime) {
  const time = getTimeFromQuarterId(quarterTimeId, minTime);
  return getTimeText(time.hourFrom, time.minuteFrom);
}

function getQuarterIdFromStartTime(timeString, minTime) {
  return getQuarterIdFromEndTime(timeString, minTime) + 1;
}

function getQuarterIdFromEndTime(timeString, minTime) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hour + time.roundedMinute / 60 - minTime) * 4;
}

function getLessonTime(start, end) {
  return `${getTimeTextFromInput(start)}-${getTimeTextFromInput(end)}`;
}
