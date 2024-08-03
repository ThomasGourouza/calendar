class Lesson {
  constructor(date, time, roomName, teacherName, levelName) {
    this.date = date;
    this.time = time;
    this.roomName = roomName;
    this.teacherName = teacherName;
    this.levelName = levelName;
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
    }
    return "";
  }

  get title() {
    return `${this.date} ${this.time} ${this.roomName}`;
  }

  get backgroundColor() {
    if (parameter.colorLessonBy === "levelName") {

    }
  }
}
