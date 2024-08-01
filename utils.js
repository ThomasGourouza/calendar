function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getNumberFromStartTime(timeString) {
  return getNumberFromEndTime(timeString) + 1;
}

function getNumberFromEndTime(timeString) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hours + time.roundedMinutes / 60 - 8) * 4;
}

function roundQuarter(hours, minutes) {
  let roundedMinutes = Math.round(minutes / 15) * 15;
  if (roundedMinutes >= 60) {
    roundedMinutes -= 60;
    hours += 1;
  }
  if (hours >= 24) {
    hours -= 24;
  }
  return { hours, roundedMinutes };
}

function getTimeTextFromTo(quarterTimeStart, quarterTimeEnd) {
  return `${quarterTimeStart.getTimeTextFrom()} - ${quarterTimeEnd.getTimeTextTo()}`;
}
