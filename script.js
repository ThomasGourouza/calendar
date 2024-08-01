const lang = "fr";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const teachers = [];

let calendarData = [];

// les quart d'heures de la journée de 8h00 à 20h00
const allQuarterTimes = [];
for (let i = 1; i <= 48; i++) {
  allQuarterTimes.push(new QuarterTime(i));
}

const roomObjects = rooms.map((name) => new RoomObject(name));

let lessons = [
  {
    itemDate: new ItemDate(9, 6, 2024),
    quarterTimes: [6, 7, 8, 9],
    room: "Room 2",
    teacher: "Thomas",
    level: "C1",
  },
  {
    itemDate: new ItemDate(9, 6, 2024),
    quarterTimes: [13, 14, 15, 16],
    room: "Room 3",
    teacher: "Thomas",
    level: "C1",
  },
  {
    itemDate: new ItemDate(10, 6, 2024),
    quarterTimes: [3, 4],
    room: "Room 1",
    teacher: "Jean",
    level: "B2",
  },
];

document.forms["calendarForm"].onsubmit = function (e) {
  e.preventDefault();
  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);

  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    console.log(`End date must be after the start date.`);
  } else {
    calendarData = getCalendarData(startDate, endDate);
    generateCalendar(calendarData);
  }
};

document.forms["addLessonForm"].reset();
document.forms["addLessonForm"].onsubmit = function (e) {
  e.preventDefault();
  const date = new Date(this.date.value);
  const itemDate = new ItemDate(
    date.getDate(),
    date.getMonth(),
    date.getFullYear()
  );
  const startTimeNumber = getNumberFromStartTime(this.startTime.value);
  const endTimeNumber = getNumberFromEndTime(this.endTime.value);
  const quarterTimes = [];
  for (let i = startTimeNumber; i <= endTimeNumber; i++) {
    quarterTimes.push(i);
  }
  const lesson = new Lesson(
    itemDate,
    quarterTimes,
    this.room.value,
    this.teacher.value,
    this.level.value
  );
  lessons.push(lesson);
  generateCalendar(calendarData);
  this.reset();

  // const startTime = new QuarterTime(startTimeNumber);
  // const endTime = new QuarterTime(endTimeNumber);
  // const timeStartEndText = getTimeTextFromTo(startTime, endTime);
};

// private
function getCalendarData(startDate, endDate) {
  const calendarData = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    calendarData.push(
      new CalendarItem(
        new ItemDate(d.getDate(), d.getMonth(), d.getFullYear()),
        allQuarterTimes.map(
          (item) => new CalendarItemTimeRoom(item, roomObjects)
        )
      )
    );
  }
  return calendarData;
}

// private
function generateCalendar(calendarData) {
  if (calendarData.length === 0) {
    return;
  }
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  const table = putElementIn("table", wrapper);
  table.className = "calendar";
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);

  const thTitle = putElementIn("th", tr1);
  thTitle.setAttribute("rowspan", 2);
  thTitle.setAttribute("colspan", 2);
  // thTitle.innerHTML = "Calendrier";

  calendarData.forEach((item) => {
    const thDay = putElementIn("th", tr1);
    thDay.setAttribute("colspan", rooms.length);
    thDay.innerHTML = item.calendarItemDate.printDate();

    rooms.forEach((name) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = name;
    });
  });

  allQuarterTimes.forEach((quarterTime) => {
    const tr = putElementIn("tr", tbody);
    const td1 = putElementIn("td", tr);
    td1.innerHTML = quarterTime.getTimeTextFrom();
    const td2 = putElementIn("td", tr);
    td2.innerHTML = quarterTime.getTimeTextTo();

    calendarData.forEach((data) => {
      data.calendarItemTimeRooms
        .find((timeRoom) => timeRoom.quarterTime.number === quarterTime.number)
        .roomObjects.forEach((roomObject) => {
          const td = putElementIn("td", tr);
          const lessonText = getLesson(
            data.calendarItemDate.date,
            data.calendarItemDate.month,
            data.calendarItemDate.year,
            quarterTime.number,
            roomObject.name
          );
          if (!!lessonText) {
            td.className = "booked";
            td.innerHTML = lessonText;
            td.setAttribute(
              "title",
              printTime(
                data.calendarItemDate.date,
                data.calendarItemDate.month,
                data.calendarItemDate.year,
                quarterTime,
                roomObject.name
              )
            );
          }
        });
    });
  });
  styleBorderThick(rooms.length);
}

function getLesson(date, month, year, quarterTime, room) {
  const lesson = lessons.find(
    (l) =>
      l.itemDate.date === date &&
      l.itemDate.month === month &&
      l.itemDate.year === year &&
      l.quarterTimes.includes(quarterTime) &&
      l.room === room
  );
  if (!!lesson) {
    return lesson.teacher + " - " + lesson.level;
  }
  return null;
}

// private
function putElementIn(element, node) {
  const elmt = document.createElement(element);
  node.appendChild(elmt);
  return elmt;
}

function changeTableStyle() {
  // Access the :root element
  const root = document.documentElement;

  // Change the values of the CSS variables
  root.style.setProperty("--table-border-radius", "25px");
  root.style.setProperty("--table-border-color", "blue");
  root.style.setProperty("--table-border-width", "3px");
  root.style.setProperty("--table-header-bg-color", "#ffcccc");
  root.style.setProperty("--table-padding", "15px");
}

function styleBorderThick(number) {
  const borderThick = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--table-border-thick");
  const cells = document.querySelectorAll(
    `table.calendar tbody tr td:nth-child(${number}n + 2):not(:last-child)`
  );
  cells.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
}

function printTime(date, month, year, quarterTime, roomName) {
  return (
    (date < 10 ? "0" + date : date) +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    year +
    " " +
    quarterTime.getTimeTextFrom() +
    "-" +
    quarterTime.getTimeTextTo() +
    ": " +
    roomName
  );
}

function generateLessonList() {
  //
}

function remove(date, month, year, startTime, room) {
  lessons = lessons.filter(
    (lesson) =>
      lesson.itemDate.date !== date ||
      lesson.itemDate.month !== month ||
      lesson.itemDate.year !== year ||
      lesson.quarterTimes[0] !== startTime ||
      lesson.room !== room
  );
  generateCalendar(calendarData);
}
