function getSelectedDates(startDate, numberDays, bankHolidays) {
  const result = [];
  const dateFrom = new Date(startDate);
  const holidays = bankHolidays.map((d) => new Date(d));
  while (result.filter((d) => d.type === "regular").length < numberDays) {
    if (![0, 6].includes(dateFrom.getDay())) {
      if (holidays.some((d) => d.getTime() === dateFrom.getTime())) {
        result.push({
          date: new Date(dateFrom),
          type: "holiday",
        });
      } else {
        result.push({
          date: new Date(dateFrom),
          type: "regular",
        });
      }
    } else if (dateFrom.getDay() == 6) {
      result.push({
        date: null,
        type: "weekend",
      });
    }
    dateFrom.setDate(dateFrom.getDate() + 1);
  }
  return result;
}
