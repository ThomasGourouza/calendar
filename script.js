const lang = "fr";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const teachers = [];

// les quart d'heures de la journée de 8h00 à 20h00
const itemQuarterTimes = [];
for (let i = 1; i <= 48; i++) {
  itemQuarterTimes.push(new QuarterTime(i));
}

const roomNames = [
  "Room 1",
  "Room 2",
  "Room 3",
  // "Room 4",
  // "Room 5",
  // "Room 6",
  // "Room 7",
  // "Room 8",
];
const rooms = roomNames.map((name) => new Room(name));

// public
function submitForm() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  const daysBetween = getDaysNumberBetween(endDate, startDate);
  if (daysBetween <= 0) {
    console.log(`End date must be after the start date.`);
  } else {
    const calendarData = getCalendarData(startDate, endDate);
    setLesson(calendarData, 9, 7, 2024, 9, 15, "Room 2", "Thomas", "C1");
    generateCalendar(calendarData);
  }
}

// private
function getCalendarData(startDate, endDate) {
  const calendarData = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    calendarData.push(
      new CalendarItem(
        new ItemDate(d.getFullYear(), d.getMonth(), d.getDate()),
        itemQuarterTimes.map((item) => new CalendarItemTimeRoom(item, rooms))
      )
    );
  }
  return calendarData;
}

// private
function generateCalendar(calendarData) {
  console.log(calendarData);
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  const table = putElementIn("table", wrapper);
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);

  const thTitle = putElementIn("th", tr1);
  thTitle.setAttribute("rowspan", 2);
  thTitle.innerHTML = "Calendrier";
  // thTitle.className = "class";

  calendarData.forEach((item) => {
    const thDay = putElementIn("th", tr1);
    thDay.setAttribute("colspan", roomNames.length);
    thDay.innerHTML = item.calendarItemDate.printDate();

    roomNames.forEach((name) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = name;
    });
  });

  itemQuarterTimes.forEach((item) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    td.innerHTML = item.getTimeText();

    calendarData.forEach((data) => {
      const dataRooms = data.calendarItemTimeRooms.find(
        (timeRoom) => timeRoom.quarterTime.number === item.number
      ).rooms;
      dataRooms.forEach((dataRoom) => {
        const td = putElementIn("td", tr);
        td.innerHTML = dataRoom.printLesson();
      });
    });
  });
  styleBorderThick(roomNames.length);
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
    `table tbody tr td:nth-child(${number}n + 1):not(:last-child)`
  );
  cells.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
}

function setLesson(
  calendarData,
  date,
  month,
  year,
  hourFrom,
  minuteFrom,
  roomName,
  teacher,
  level
) {
  calendarData
    .find((item) => item.isDate(date, month, year))
    .setLessonQuarter(hourFrom, minuteFrom, roomName, teacher, level);
}
