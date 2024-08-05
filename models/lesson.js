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

  get timeFrom() {
    return this.time.split("-")[0];
  }

  get timeTo() {
    return this.time.split("-")[1];
  }

  getQuarterIds(minTime) {
    const timeStartEndArray = this.time.split("-");
    const quarterIdFromStartTime = getQuarterIdFromStartTime(
      timeStartEndArray[0],
      minTime
    );
    const quarterIdFromEndTime = getQuarterIdFromEndTime(
      timeStartEndArray[1],
      minTime
    );
    const quarterIds = [];
    for (let i = quarterIdFromStartTime; i <= quarterIdFromEndTime; i++) {
      quarterIds.push(i);
    }
    return quarterIds;
  }

  getInnerHtml(quarterId, minTime) {
    if (this.getQuarterIds(minTime)[0] === quarterId) {
      return `${this.levelName} - ${this.teacherName}`;
    } else if (this.getQuarterIds(minTime)[1] === quarterId) {
      return `${this.time}`;
    }
    return "";
  }

  get title() {
    return `${this.date} ${this.time} ${this.roomName}`;
  }

  getBackgroundColor(colorLessonBy) {
    return colorLessonBy === "levelName"
      ? levels.find((level) => level.name === this.levelName)?.color
      : teachers.find((teacher) => teacher.name === this.teacherName)?.color;
  }
}
