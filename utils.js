function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getNumberFromStartTime(hourFrom, minuteFrom) {
  return (hourFrom + minuteFrom / 60 - 8) * 4 + 1;
}
