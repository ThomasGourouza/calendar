class CalendarItem {
  constructor(calendarItemDate, calendarItemTimeRooms) {
    this.calendarItemDate = calendarItemDate;
    this.calendarItemTimeRooms = calendarItemTimeRooms;
  }

  isDate(date, month, year) {
    return (
      this.calendarItemDate.date === date &&
      this.calendarItemDate.month === month &&
      this.calendarItemDate.year === year
    );
  }

  setLessonQuarter(hourFrom, minuteFrom, roomName, teacher, level) {
    this.calendarItemTimeRooms
      .find(
        (item) =>
          item.quarterTime.number ===
          getNumberFromStartTime(hourFrom, minuteFrom)
      )
      .rooms.find((room) => room.name === roomName)
      .setLesson(teacher, level);
  }
}
