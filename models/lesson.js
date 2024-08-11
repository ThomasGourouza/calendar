class Lesson {
  constructor(date, teacherName, level) {
    this.date = date;
    this.teacherName = teacherName;
    this.level = level;
    this.highlight = false;
  }

  get localDate() {
    const [day, month, year] = this.date.split("/");
    return new Date(+year, +month - 1, +day);
  }

  get backgroundColor() {
    return teachers.find((teacher) => teacher.name === this.teacherName)?.color;
  }
}
