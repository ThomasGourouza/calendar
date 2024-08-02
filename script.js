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
  {
    calendarItemDate: new CalendarItemDate(9, 6, 2024),
    quarterTimes: [18, 19, 20],
    room: "Room 2",
    teacher: "New",
    level: "B2",
  },
];

fillSelectOptions("rooms", rooms);
fillSelectOptions("levels", levels);
fillSelectOptions("teachers", teachers);

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
    const td = putElementIn("td", tr);
    if ([1, 3].includes(quarterTime.number % 4)) {
      td.innerHTML = quarterTime.getTimeTextFrom();
    }
    calendarItems.forEach((data) => {
      data.calendarItemTimeRooms
        .find((timeRoom) => timeRoom.quarterTime.number === quarterTime.number)
        .roomObjects.forEach((roomObject) => {
          const td = putElementIn("td", tr);
          setLunchTime(td, quarterTime.number);
          setLessonIfExist(td, quarterTime, data, roomObject);
        });
    });
  });
  styleBorderThick();
  styleColorCells();
}

function setLunchTime(td, quarterTimeNumber) {
  if (quarterTimeNumber >= 17 && quarterTimeNumber <= 24) {
    td.className = "lunch";
  }
}

function setLessonIfExist(td, quarterTime, data, roomObject) {
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

function styleBorderThick() {
  const roomLength = rooms.length;
  const borderThick = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--table-border-thick");
  const cellsRoomHeaders = document.querySelectorAll(
    `table.calendar thead tr:not(:first-child) th:nth-child(${roomLength}n):not(:last-child)`
  );
  const cellContentCells = document.querySelectorAll(
    `table.calendar tbody tr td:nth-child(${roomLength}n + 1):not(:last-child)`
  );
  cellsRoomHeaders.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
  cellContentCells.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
}

function styleColorCells() {
  // normal cells
  const allCellsSelector = `table.calendar tbody tr td:not(:first-child):not(.booked)`;
  styleColorEvenCells(
    "--table-content-odd",
    "--table-content-even",
    allCellsSelector
  );
  // lunch cells
  const allLunchCellsSelector = `table.calendar td.lunch:not(.booked)`;
  styleColorEvenCells(
    "--table-lunch-odd",
    "--table-lunch-even",
    allLunchCellsSelector
  );
}

function styleColorEvenCells(
  colorOddCssVariable,
  colorEvenCssVariable,
  allCellsSelector
) {
  colorCells(allCellsSelector, getStyle(colorOddCssVariable));
  const roomLength = rooms.length;
  let evenCellsSelector = "";
  for (let i = 0; i < roomLength; i++) {
    const a = 2 * roomLength;
    const b = i + 2 - roomLength;
    const signB = b < 0 ? "-" : "+";
    const absB = Math.abs(b);
    evenCellsSelector += `${allCellsSelector}:nth-child(${a}n ${signB} ${absB})`;
    if (i < roomLength - 1) {
      evenCellsSelector += ", ";
    }
  }
  colorCells(evenCellsSelector, getStyle(colorEvenCssVariable));
}

function colorCells(cellsSelector, color) {
  document.querySelectorAll(cellsSelector).forEach((cell) => {
    cell.style.backgroundColor = color;
  });
}

function getStyle(cssVariable) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    cssVariable
  );
}

function printTime(date, month, year, quarterTime, roomName) {
  const d = date < 10 ? "0" + date : date;
  const m = month < 10 ? "0" + month : month;
  const timeFrom = quarterTime.getTimeTextFrom();
  const timeTo = quarterTime.getTimeTextTo();
  return `${d}/${m}/${year} ${timeFrom}-${timeTo}: ${roomName}`;
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
