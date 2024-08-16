class Level {
  constructor(name, parameter) {
    this.active = true;
    this.name = name;
    this.hours = parameter.numberDays * parameter.lessonDuration;
  }
}
