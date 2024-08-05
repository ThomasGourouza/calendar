function formatNumberToText(number) {
  if (number === 0) {
    return "00";
  }
  return number < 10 ? `0${number}` : number;
}

function getTimeTextFromInput(value) {
  const timeArray = value.split(":");
  const roundTime = roundQuarter(+timeArray[0], +timeArray[1]);
  return getTimeText(roundTime.hour, roundTime.roundedMinute);
}

function getTimeText(hour, minute) {
  return `${formatNumberToText(hour)}:${formatNumberToText(minute)}`;
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

function getTimeFromQuarterId(quarterTimeId, minTime) {
  const timeNumber = minTime + (quarterTimeId - 1) / 4;
  const hourFrom = Math.floor(timeNumber);
  const minuteFrom = (timeNumber - hourFrom) * 60;
  return {
    hourFrom,
    minuteFrom,
  };
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

function getMonthText(month, lang) {
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
