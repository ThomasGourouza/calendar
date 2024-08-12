class Lesson {
  constructor(date, teacherName, levelName) {
    this.date = date;
    this.teacherName = teacherName;
    this.levelName = levelName;
    this.highlight = false;
  }

  get localDate() {
    const [day, month, year] = this.date.split("/");
    return new Date(+year, +month - 1, +day);
  }

  get backgroundColor() {
    return teachers.find((teacher) => teacher.name === this.teacherName)?.color;
  }
  get textColor() {
    return teachers.find((teacher) => teacher.name === this.teacherName)?.textColor;
  }
}
