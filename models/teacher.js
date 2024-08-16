class Teacher {
  constructor(name, parameter, color) {
    this.name = name;
    this.color = color.backgroundColor;
    this.textColor = color.textColor;
    this.recurrentDaysOff = [];
    this.daysOff = [];
    this.workingHours = {
      min: parameter.lessonDuration,
      max: parameter.lessonDuration * parameter.numberDays,
    };
    this.preferedLevelNames = [];
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
