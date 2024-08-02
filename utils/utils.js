function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getNumberFromStartTime(timeString) {
  return getNumberFromEndTime(timeString) + 1;
}

function getNumberFromEndTime(timeString) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hours + time.roundedMinutes / 60 - 8) * 4;
}

function roundQuarter(hours, minutes) {
  let roundedMinutes = Math.round(minutes / 15) * 15;
  if (roundedMinutes >= 60) {
    roundedMinutes -= 60;
    hours += 1;
  }
  if (hours >= 24) {
    hours -= 24;
  }
  return { hours, roundedMinutes };
}

function getTimeTextFromTo(quarterTimeStart, quarterTimeEnd) {
  return `${quarterTimeStart.getTimeTextFrom()} - ${quarterTimeEnd.getTimeTextTo()}`;
}

function printTime(date, month, year, quarterTime, roomName) {
  const d = date < 10 ? "0" + date : date;
  const m = month < 10 ? "0" + month : month;
  const timeFrom = quarterTime.getTimeTextFrom();
  const timeTo = quarterTime.getTimeTextTo();
  return `${d}/${m}/${year} ${timeFrom}-${timeTo}: ${roomName}`;
}

function fillSelectOptions(selectId, optionList) {
  const select = document.getElementById(selectId);
  optionList.forEach((value) => {
    const option = putElementIn("option", select);
    option.setAttribute("value", value);
    option.innerHTML = value;
  });
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

function changeStyle(cssVariable, value) {
  document.documentElement.style.setProperty(cssVariable, value);
  // getComputedStyle(document.documentElement).setProperty(cssVariable, value);
}

function putElementIn(element, node) {
  const elmt = document.createElement(element);
  node.appendChild(elmt);
  return elmt;
}

function printLessonIfExist(td, quarterTime, data, room) {
  const lessonText = getLessonToPrint(
    data.calendarItemDate.date,
    data.calendarItemDate.month,
    data.calendarItemDate.year,
    quarterTime.number,
    room
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
        room
      )
    );
  }
}

function getLessonToPrint(date, month, year, quarterTime, room) {
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

function setLunchTime(td, quarterTimeNumber) {
  if (quarterTimeNumber >= 17 && quarterTimeNumber <= 24) {
    td.className = "lunch";
  }
}
