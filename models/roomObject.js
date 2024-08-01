class RoomObject {
  constructor(name) {
    this.name = name;
    this.lesson = null;
  }

  setLesson(teacher, level) {
    this.lesson = {
      teacher,
      level,
    };
  }

  removeLesson() {
    this.lesson = null;
  }

  isAvailable() {
    return this.lesson == null;
  }

  printLesson() {
    return this.lesson != null
      ? this.lesson.teacher + " - " + this.lesson.level
      : "";
  }
}