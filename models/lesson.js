class Lesson {
  constructor(date, time, roomName, teacherName, levelName) {
    this.date = date;
    this.time = time;
    this.roomName = roomName;
    this.teacherName = teacherName;
    this.levelName = levelName;
    this.highlight = false;
  }

  get localDate() {
    const [day, month, year] = this.date.split("/");
    return new Date(+year, +month - 1, +day);
  }

  printDate() {
    return this.date + " en lettres";
  }

  printTimeFrom() {
    return this.time + " From";
  }

  printTimeTo() {
    return this.time + " To";
  }

  getQuarterIds(param) {
    const timeStartEndArray = this.time.split("-");
    const quarterIdFromStartTime = getQuarterIdFromStartTime(
      timeStartEndArray[0],
      param
    );
    const quarterIdFromEndTime = getQuarterIdFromEndTime(
      timeStartEndArray[1],
      param
    );
    const quarterIds = [];
    for (let i = quarterIdFromStartTime; i <= quarterIdFromEndTime; i++) {
      quarterIds.push(i);
    }
    return quarterIds;
  }

  getInnerHtml(quarterId, param) {
    if (this.getQuarterIds(param)[0] === quarterId) {
      return `${this.levelName} - ${this.teacherName}`;
    } else if (this.getQuarterIds(param)[1] === quarterId) {
      return `${this.time}`;
    }
    return "";
  }

  get title() {
    return `${this.date} ${this.time} ${this.roomName}`;
  }

  getBackgroundColor(param) {
    return param?.colorLessonBy === "levelName"
      ? levels.find((level) => level.name === this.levelName)?.color
      : teachers.find((teacher) => teacher.name === this.teacherName)?.color;
  }
}
