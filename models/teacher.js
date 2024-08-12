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
    console.log(selectedDates, this.recurrentDaysOff, daysOff);
  }
}
