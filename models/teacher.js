class Teacher {
  constructor(
    name,
    backgroundColor,
    textColor,
    workingHoursMin,
    workingHoursMax,
    recurrentDaysOff = [],
    daysOff = [],
    preferedLevelNames = []
  ) {
    this.name = name;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.workingHours = {
      min: workingHoursMin,
      max: workingHoursMax,
    };
    this.recurrentDaysOff = recurrentDaysOff;
    this.daysOff = daysOff;
    this.preferedLevelNames = preferedLevelNames;
  }

  getAvailabilities(selectedDates) {
    return selectedDates
      .filter(
        (date) =>
          date.type === "regular" &&
          !this.recurrentDaysOff.map((d) => +d).includes(date.date.getDay()) &&
          !this.daysOff
            .map((d) => new Date(d))
            .some((d) => d.getTime() === date.date.getTime())
      )
      .map((d) => getDateTextFromLocalDate(d.date));
  }

  getPeriodDaysOff(selectedDates) {
    const selectedDatesText = selectedDates
      .filter((date) => date.type === "regular")
      .map((d) => textDateToInput(d.date));
    return this.daysOff.filter((d) => selectedDatesText.includes(d));
  }
}
