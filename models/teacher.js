class Teacher {
  constructor(
    name,
    backgroundColor,
    textColor,
    parameter,
    recurrentDaysOff = [],
    daysOff = [],
    preferedLevelNames = []
  ) {
    this.name = name;
    this.color = backgroundColor;
    this.textColor = textColor;
    this.workingHours = {
      min: parameter.lessonDuration,
      max: parameter.lessonDuration * parameter.numberDays,
    };
    this.recurrentDaysOff = recurrentDaysOff;
    this.daysOff = daysOff;
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
