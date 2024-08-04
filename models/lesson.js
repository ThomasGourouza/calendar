class Lesson {
  constructor(date, time, roomName, teacherName, levelName) {
    this.date = date;
    this.time = time;
    this.roomName = roomName;
    this.teacherName = teacherName;
    this.levelName = levelName;
    this.highlight = false;
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

  get quarterIds() {
    const timeStartEndArray = this.time.split("-");
    const quarterIdFromStartTime = getQuarterIdFromStartTime(
      timeStartEndArray[0]
    );
    const quarterIdFromEndTime = getQuarterIdFromEndTime(timeStartEndArray[1]);
    const quarterIds = [];
    for (let i = quarterIdFromStartTime; i <= quarterIdFromEndTime; i++) {
      quarterIds.push(i);
    }
    return quarterIds;
  }

  innerHtml(quarterId) {
    if (this.quarterIds[0] === quarterId) {
      return `${this.levelName} - ${this.teacherName}`;
    } else if (this.quarterIds[1] === quarterId) {
      return `${this.time}`;
    }
    return "";
  }

  get title() {
    return `${this.date} ${this.time} ${this.roomName}`;
  }

  get backgroundColor() {
    return parameter?.colorLessonBy === "levelName"
      ? levels.find((level) => level.name === this.levelName)?.color
      : teachers.find((teacher) => teacher.name === this.teacherName)?.color;
  }
}
