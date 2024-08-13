class Teacher {
  constructor(
    name,
    color,
    textColor,
    recurrentDaysOff,
    daysOff,
    workingHours,
    preferedLevelNames
  ) {
    this.name = name;
    this.color = color;
    this.textColor = textColor;
    this.recurrentDaysOff = recurrentDaysOff;
    this.daysOff = daysOff;
    this.workingHours = workingHours;
    this.preferedLevelNames = preferedLevelNames;
  }

  getAvailabilities(selectedDates) {
    const availabilities = selectedDates
      .filter(
        (date) =>
          date.type === "regular" &&
          !this.recurrentDaysOff.map((d) => +d).includes(date.date.getDay()) &&
          !this.daysOff
            .map((d) => new Date(d))
            .some((d) => d.getTime() === date.date.getTime())
      )
      .map((d) => getDateTextFromLocalDate(d.date));
    return availabilities;
  }
}
