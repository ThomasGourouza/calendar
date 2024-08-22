class Level {
  constructor(name, active = true) {
    this.name = name;
    this.active = active;
    this.hours = parameter.numberDays * parameter.lessonDuration;
  }
}
