function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getIdFromStartTime(timeString) {
  return getIdFromEndTime(timeString) + 1;
}

function getIdFromEndTime(timeString) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hour + time.roundedMinute / 60 - minTime) * 4;
}

function roundQuarter(hour, minute) {
  let roundedMinute = Math.round(minute / 15) * 15;
  if (roundedMinute >= 60) {
    roundedMinute -= 60;
    hour += 1;
  }
  if (hour >= 24) {
    hour -= 24;
  }
  return { hour, roundedMinute };
}

function getTimeTextFromTo(quarterTimeStart, quarterTimeEnd) {
  return `${quarterTimeStart.getTimeTextFrom()} - ${quarterTimeEnd.getTimeTextTo()}`;
}

// TODO: duplicate ?
function printTime(date, timeTextFrom, timeTextTo, room) {
  return `${date} ${timeTextFrom}-${timeTextTo}: ${room}`;
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

function checkLesson(td, timeTextFrom, timeTextTo, date, room) {
  const lessonText = getLessonToPrint(date, timeTextFrom, timeTextTo, room);
  if (!!lessonText) {
    td.className = "booked";
    td.innerHTML = lessonText;
    td.setAttribute("title", printTime(date, timeTextFrom, timeTextTo, room));
  }
}

function getLessonToPrint(date, timeTextFrom, timeTextTo, room) {
  const lesson = lessons.find(
    (l) =>
      l.date === date &&
      (l.time.split("-")[0] === timeTextFrom ||
        l.time.split("-")[1] === timeTextTo) &&
      l.room === room
  );
  if (!!lesson) {
    return lesson.teacher + " - " + lesson.level;
  }
  return null;
}

function checkLunchTime(td, quarterTimeId) {
  const minLunchTimeText = `${Math.floor(minLunchTime)}:${
    (minLunchTime - Math.floor(minLunchTime)) * 60
  }`;
  const maxLunchTimeText = `${Math.floor(maxLunchTime)}:${
    (maxLunchTime - Math.floor(maxLunchTime)) * 60
  }`;
  if (
    quarterTimeId >= getIdFromStartTime(minLunchTimeText) &&
    quarterTimeId <= getIdFromEndTime(maxLunchTimeText)
  ) {
    td.className = "lunch";
  }
}

function formatMinute(minute) {
  return minute === 0 ? "00" : minute;
}

function formatHour(hour) {
  return hour < 10 ? `0${hour}` : hour;
}

function getTimeText(hour, minute) {
  return `${formatHour(hour)}:${formatMinute(minute)}`;
}

function getTimeTextFromInput(value) {
  const timeArray = value.split(":");
  const roundTime = roundQuarter(+timeArray[0], +timeArray[1]);
  return getTimeText(roundTime.hour, roundTime.roundedMinute);
}

function getTime(start, end) {
  return `${start}-${end}`;
}

function printDate(date) {
  return date + " en lettres";
}

function printTimeFrom(time) {
  return time + " From";
}

function printTimeTo(time) {
  return time + " To";
}
