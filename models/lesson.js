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
  
}
