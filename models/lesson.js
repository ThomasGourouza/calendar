class Lesson {
  constructor(date, time, room, teacher, level) {
    this.date = date;
    this.time = time;
    this.room = room;
    this.teacher = teacher;
    this.level = level;
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
      return `${this.level} - ${this.teacher}`;
    }
    return "";
  }

  get title() {
    return `${this.date} ${this.time} ${this.room}`;
  }

  get backgroundColor() {
    if (parameter.colorLessonBy === "level") {
      
    }
  }
}
