function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

// TODO: duplicate ?
function printTime(date, timeTextFrom, timeTextTo, roomName) {
  return `${date} ${timeTextFrom}-${timeTextTo}: ${roomName}`;
}

function formatNumberToText(number) {
  if (number === 0) {
    return "00";
  }
  return number < 10 ? `0${number}` : number;
}

function getTimeText(hour, minute) {
  return `${formatNumberToText(hour)}:${formatNumberToText(minute)}`;
}

function getTimeTextFromInput(value) {
  const timeArray = value.split(":");
  const roundTime = roundQuarter(+timeArray[0], +timeArray[1]);
  return getTimeText(roundTime.hour, roundTime.roundedMinute);
}

function getTime(start, end) {
  return `${getTimeTextFromInput(start)}-${getTimeTextFromInput(end)}`;
}

function getTimeFromQuarterId(quarterTimeId, minTime) {
  const timeNumber = minTime + (quarterTimeId - 1) / 4;
  const hourFrom = Math.floor(timeNumber);
  const minuteFrom = (timeNumber - hourFrom) * 60;
  const timeNumberTo = timeNumber + 0.25;
  const hourTo = Math.floor(timeNumberTo);
  const minuteTo = (timeNumberTo - hourTo) * 60;
  return {
    from: {
      hour: hourFrom,
      minute: minuteFrom,
    },
    to: {
      hour: hourTo,
      minute: minuteTo,
    },
  };
}

function getTimeTextFrom(quarterTimeId, minTime) {
  const time = getTimeFromQuarterId(quarterTimeId, minTime);
  return getTimeText(time.from.hour, time.from.minute);
}

function getDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function getDateFromLocalDate(d) {
  return `${formatNumberToText(d.getDate())}/${formatNumberToText(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
}

function printDateText(d, lang) {
  return `${getDayText(d.getDay(), lang)} ${d.getDate()} ${toMonthText(
    d.getMonth() + 1,
    lang
  )} ${d.getFullYear()}`;
}

function getQuarterIdFromStartTime(timeString, minTime) {
  return getQuarterIdFromEndTime(timeString, minTime) + 1;
}

function getQuarterIdFromEndTime(timeString, minTime) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hour + time.roundedMinute / 60 - minTime) * 4;
}

function roundQuarter(hour, minute) {
  let roundedMinute = Math.round(minute / 15) * 15;
  if (roundedMinute >= 60) {
    roundedMinute -= 60;
    hour += 1;
  }
  if (hour >= 24) {
    hour -= 24;
  }
  return { hour, roundedMinute };
}

function getDayText(day, lang) {
  switch (day) {
    case 1:
      return lang === "en" ? "Monday" : "Lundi";
    case 2:
      return lang === "en" ? "Tuesday" : "Mardi";
    case 3:
      return lang === "en" ? "Wednesday" : "Mercredi";
    case 4:
      return lang === "en" ? "Thursday" : "Jeudi";
    case 5:
      return lang === "en" ? "Friday" : "Vendredi";
    case 6:
      return lang === "en" ? "Saturday" : "Samedi";
    case 7:
      return lang === "en" ? "Sunday" : "Dimanche";
    default:
      return "";
  }
}

function toMonthText(month, lang) {
  switch (month) {
    case 1:
      return lang === "en" ? "January" : "Janvier";
    case 2:
      return lang === "en" ? "February" : "Février";
    case 3:
      return lang === "en" ? "March" : "Mars";
    case 4:
      return lang === "en" ? "April" : "Avril";
    case 5:
      return lang === "en" ? "May" : "Mai";
    case 6:
      return lang === "en" ? "June" : "Juin";
    case 7:
      return lang === "en" ? "July" : "Juillet";
    case 8:
      return lang === "en" ? "August" : "Août";
    case 9:
      return lang === "en" ? "September" : "Septembre";
    case 10:
      return lang === "en" ? "October" : "Octobre";
    case 11:
      return lang === "en" ? "November" : "Novembre";
    case 12:
      return lang === "en" ? "December" : "Décembre";
    default:
      return "";
  }
}
