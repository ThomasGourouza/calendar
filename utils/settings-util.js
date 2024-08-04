function getQuarterTimes(minTime, maxTime) {
  const quarterTimes = [];
  for (let i = 1; i <= (maxTime - minTime) * 4; i++) {
    quarterTimes.push(i);
  }
  return quarterTimes;
}

function getSelectedDates(startDate, endDate) {
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);
  let dates = [];
  for (let date = dateFrom; date <= dateTo; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date));
  }
  return dates;
}
