const lang = "fr";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let calendarItems = [];

// les quart d'heures de la journée de 8h00 à 20h00
const allQuarterTimes = [];
for (let i = 1; i <= 48; i++) {
  allQuarterTimes.push(new QuarterTime(i));
}

const roomObjects = rooms.map((name) => new RoomObject(name));

let lessons = [
  {
    calendarItemDate: new CalendarItemDate(9, 6, 2024),
    quarterTimes: [6, 7, 8, 9],
    room: "Room 2",
    teacher: "Thomas",
    level: "C1",
  },
  {
    calendarItemDate: new CalendarItemDate(9, 6, 2024),
    quarterTimes: [13, 14, 15, 16],
    room: "Room 3",
    teacher: "Thomas",
    level: "C1",
  },
  {
    calendarItemDate: new CalendarItemDate(10, 6, 2024),
    quarterTimes: [3, 4],
    room: "Room 1",
    teacher: "Jean",
    level: "B2",
  },
];

fillSelectOptions("rooms", rooms);
fillSelectOptions("levels", levels);

generateLessonList();

document.forms["calendarForm"].onsubmit = function (e) {
  e.preventDefault();
  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);

  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    console.log(`End date must be after the start date.`);
  } else {
    calendarItems = getCalendarData(startDate, endDate);
    generateCalendar();
  }
};

document.forms["addLessonForm"].reset();
document.forms["addLessonForm"].onsubmit = function (e) {
  e.preventDefault();
  const date = new Date(this.date.value);
  const calendarItemDate = new CalendarItemDate(
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
    calendarItemDate,
    quarterTimes,
    this.room.value,
    this.teacher.value,
    this.level.value
  );
  lessons.push(lesson);
  generateLessonList();
  generateCalendar();
  this.reset();
};

// private
function getCalendarData(startDate, endDate) {
  const calendarItems = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    calendarItems.push(
      new CalendarItem(
        new CalendarItemDate(d.getDate(), d.getMonth(), d.getFullYear()),
        allQuarterTimes.map(
          (item) => new CalendarItemTimeRoom(item, roomObjects)
        )
      )
    );
  }
  return calendarItems;
}

// private
function generateCalendar() {
  if (calendarItems.length === 0) {
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

  calendarItems.forEach((item) => {
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

    calendarItems.forEach((data) => {
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
      l.calendarItemDate.date === date &&
      l.calendarItemDate.month === month &&
      l.calendarItemDate.year === year &&
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
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");

  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }

  lessons.forEach((lesson) => {
    const tr = putElementIn("tr", lessonsTbody);
    const dateTd = putElementIn("td", tr);
    dateTd.innerHTML = lesson.calendarItemDate.printDate();

    const timeFromTd = putElementIn("td", tr);
    const startTime = new QuarterTime(lesson.quarterTimes[0]);
    timeFromTd.innerHTML = startTime.getTimeTextFrom();

    const timeToTd = putElementIn("td", tr);
    const endTime = new QuarterTime(
      lesson.quarterTimes[lesson.quarterTimes.length - 1]
    );
    timeToTd.innerHTML = endTime.getTimeTextTo();

    const roomTd = putElementIn("td", tr);
    roomTd.innerHTML = lesson.room;

    const teacherTd = putElementIn("td", tr);
    teacherTd.innerHTML = lesson.teacher;

    const levelTd = putElementIn("td", tr);
    levelTd.innerHTML = lesson.level;

    const removeButtonTd = putElementIn("td", tr);
    const removeButtonDiv = putElementIn("div", removeButtonTd);
    removeButtonDiv.className = "button";
    removeButtonDiv.onclick = () => {
      removeLesson(
        lesson.calendarItemDate.date,
        lesson.calendarItemDate.month,
        lesson.calendarItemDate.year,
        lesson.quarterTimes[0],
        lesson.room
      );
    };
    removeButtonDiv.innerHTML = "-";
  });
}

function removeLesson(date, month, year, startTime, room) {
  console.log(lessons);
  lessons = lessons.filter(
    (lesson) =>
      lesson.calendarItemDate.date !== date ||
      lesson.calendarItemDate.month !== month ||
      lesson.calendarItemDate.year !== year ||
      lesson.quarterTimes[0] !== startTime ||
      lesson.room !== room
  );
  generateLessonList();
  generateCalendar();
}

function fillSelectOptions(selectId, optionList) {
  const select = document.getElementById(selectId);
  optionList.forEach((value) => {
    const option = putElementIn("option", select);
    option.setAttribute("value", value);
    option.innerHTML = value;
  });
}
