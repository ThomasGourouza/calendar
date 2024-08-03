function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getQuarterIdFromStartTime(timeString) {
  return getQuarterIdFromEndTime(timeString) + 1;
}

function getQuarterIdFromEndTime(timeString) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hour + time.roundedMinute / 60 - parameter.minTime) * 4;
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
  return `${getTimeTextFrom(quarterTimeStart)} - ${getTimeTextTo(
    quarterTimeEnd
  )}`;
}

// TODO: duplicate ?
function printTime(date, timeTextFrom, timeTextTo, roomName) {
  return `${date} ${timeTextFrom}-${timeTextTo}: ${roomName}`;
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
  const roomLength = filterRooms(rooms).length;
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
  const roomLength = filterRooms(rooms).length;
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

function existingLesson(lessonList, date, quarterTime, roomName) {
  return lessonList.find(
    (l) =>
      l.date === date &&
      l.quarterIds.includes(quarterTime) &&
      l.roomName === roomName
  );
}

function isLunchTime(quarterTimeId) {
  const minLunchTimeText = `${Math.floor(parameter.minLunchTime)}:${
    (parameter.minLunchTime - Math.floor(parameter.minLunchTime)) * 60
  }`;
  const maxLunchTimeText = `${Math.floor(parameter.maxLunchTime)}:${
    (parameter.maxLunchTime - Math.floor(parameter.maxLunchTime)) * 60
  }`;
  return (
    quarterTimeId >= getQuarterIdFromStartTime(minLunchTimeText) &&
    quarterTimeId <= getQuarterIdFromEndTime(maxLunchTimeText)
  );
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
  return `${getTimeTextFromInput(start)}-${getTimeTextFromInput(end)}`;
}

function getTimeFromQuarterId(quarterTimeId) {
  const timeNumber = parameter.minTime + (quarterTimeId - 1) / 4;
  const hourFrom = Math.floor(timeNumber);
  const minuteFrom = (timeNumber - hourFrom) * 60;
  const timeNumberTo = timeNumber + 0.25;
  const hourTo = Math.floor(timeNumberTo);
  const minuteTo = (timeNumberTo - hourTo) * 60;
  return {
    from: {
      hour: hourFrom,
      minute: minuteFrom,
    },
    to: {
      hour: hourTo,
      minute: minuteTo,
    },
  };
}

function getTimeTextFrom(quarterTimeId) {
  const time = getTimeFromQuarterId(quarterTimeId);
  return getTimeText(time.from.hour, time.from.minute);
}

function getTimeTextTo(quarterTimeId) {
  const time = getTimeFromQuarterId(quarterTimeId);
  return getTimeText(time.to.hour, time.to.minute);
}

function filterAndSort(lessonList) {
  return sort(filter(lessonList));
}

function sort(lessonList) {
  function getComparableDateTime(dateStr, timeStr) {
    const [day, month, year] = dateStr.split("/");
    const [startTime] = timeStr.split("-");
    return new Date(`${year}-${month}-${day}T${startTime}:00`);
  }
  lessonList.sort((a, b) => {
    const dateTimeA = getComparableDateTime(a.date, a.time);
    const dateTimeB = getComparableDateTime(b.date, b.time);
    return dateTimeA - dateTimeB;
  });
  return lessonList;
}

function filter(lessonList) {
  let newLessonList = [...lessonList];
  if (filters.length > 0) {
    filters.forEach((filter) => {
      newLessonList = newLessonList.filter(
        (lesson) => lesson[filter.field] === filter.value
      );
    });
  }
  return newLessonList;
}

function filterRooms(rooms) {
  let newRoomList = [...rooms];
  const filterRoom = filters.find((filter) => filter.field === "roomName");
  if (!!filterRoom) {
    newRoomList = newRoomList.filter((room) => room.name === filterRoom.value);
  }
  return newRoomList;
}
