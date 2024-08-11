function getSelectedDates(startDate, numberDays) {
  const result = [];
  const dateFrom = new Date(startDate);
  let daysAdded = 0;
  while (daysAdded < numberDays) {
    if (![0, 6].includes(dateFrom.getDay())) {
      result.push(new Date(dateFrom));
      daysAdded++;
    } else if (dateFrom.getDay() == 6) {
      result.push("");
      daysAdded++;
    }
    dateFrom.setDate(dateFrom.getDate() + 1);
  }
  return result;
}
