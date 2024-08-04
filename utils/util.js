function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getQuarterIdFromStartTime(timeString, param) {
  return getQuarterIdFromEndTime(timeString, param) + 1;
}

function getQuarterIdFromEndTime(timeString, param) {
  const timeArray = timeString.split(":");
  const time = roundQuarter(+timeArray[0], +timeArray[1]);
  return (time.hour + time.roundedMinute / 60 - param.minTime) * 4;
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

// TODO: remove
function getTimeTextFromTo(quarterTimeStart, quarterTimeEnd, param) {
  return `${getTimeTextFrom(quarterTimeStart, param)} - ${getTimeTextTo(
    quarterTimeEnd,
    param
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

function styleBorderThick(filters) {
  const roomLength = filterRooms(rooms, filters).length;
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

function styleColorCalendarCells(filters) {
  // normal cells
  const allCellsSelector = `table.calendar tbody tr td:not(:first-child):not(.booked)`;
  styleColorEvenCells(
    "--table-content-odd",
    "--table-content-even",
    allCellsSelector,
    filters
  );
  // lunch cells
  const allLunchCellsSelector = `table.calendar td.lunch:not(.booked)`;
  styleColorEvenCells(
    "--table-lunch-odd",
    "--table-lunch-even",
    allLunchCellsSelector,
    filters
  );
}

function styleColorEvenCells(
  colorOddCssVariable,
  colorEvenCssVariable,
  allCellsSelector,
  filters
) {
  colorCells(allCellsSelector, getStyle(colorOddCssVariable));
  const roomLength = filterRooms(rooms, filters).length;
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

function existingLesson(lessonList, date, quarterTime, roomName, param) {
  return lessonList.find(
    (l) =>
      l.date === date &&
      l.getQuarterIds(param).includes(quarterTime) &&
      l.roomName === roomName
  );
}

function isLunchTime(quarterTimeId, param) {
  const minLunchTimeText = `${Math.floor(param.minLunchTime)}:${
    (param.minLunchTime - Math.floor(param.minLunchTime)) * 60
  }`;
  const maxLunchTimeText = `${Math.floor(param.maxLunchTime)}:${
    (param.maxLunchTime - Math.floor(param.maxLunchTime)) * 60
  }`;
  return (
    quarterTimeId >= getQuarterIdFromStartTime(minLunchTimeText, param) &&
    quarterTimeId <= getQuarterIdFromEndTime(maxLunchTimeText, param)
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

function getTimeFromQuarterId(quarterTimeId, param) {
  const timeNumber = param.minTime + (quarterTimeId - 1) / 4;
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

function getTimeTextFrom(quarterTimeId, param) {
  const time = getTimeFromQuarterId(quarterTimeId, param);
  return getTimeText(time.from.hour, time.from.minute);
}

function getTimeTextTo(quarterTimeId, param) {
  const time = getTimeFromQuarterId(quarterTimeId, param);
  return getTimeText(time.to.hour, time.to.minute);
}

function filterAndSort(lessonList, param, filters) {
  return sort(filter(lessonList, param, filters));
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

function filter(lessonList, param, filters) {
  let newLessonList = [...lessonList];
  if (param.visibility === "selected") {
    const minDate = new Date(param.startDate);
    const maxDate = new Date(param.endDate);
    minDate.setDate(minDate.getDate() - 1);
    newLessonList = newLessonList.filter(
      (lesson) => lesson.localDate >= minDate && lesson.localDate <= maxDate
    );
  }
  if (filters.length > 0) {
    filters.forEach((filter) => {
      newLessonList = newLessonList.filter(
        (lesson) => lesson[filter.field] === filter.value
      );
    });
  }
  return newLessonList;
}

function filterRooms(rooms, filters) {
  let newRoomList = [...rooms];
  const filterRoom = filters.find((filter) => filter.field === "roomName");
  if (!!filterRoom) {
    newRoomList = newRoomList.filter((room) => room.name === filterRoom.value);
  }
  return newRoomList;
}

function fillTdWithNameAndDisk(td, name, lesson, list, param) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = lesson[name];
  const divDisk = putElementIn("div", wrapper);
  if (param.colorLessonBy === name) {
    divDisk.style.backgroundColor = list.find(
      (item) => item.name === lesson[name]
    )?.color;
  }
}

function getQuarterTimes(param) {
  const quarterTimes = [];
  for (let i = 1; i <= (param.maxTime - param.minTime) * 4; i++) {
    quarterTimes.push(i);
  }
  return quarterTimes;
}

function setForm(form, param) {
  form.minTime.value = param.minTime;
  form.maxTime.value = param.maxTime;
  form.minLunchTime.value = param.minLunchTime;
  form.maxLunchTime.value = param.maxLunchTime;
  form.minLessonTime.value = param.minLessonTime;
  form.maxLessonTime.value = param.maxLessonTime;
  form.maxDays.value = param.maxDays;
  form.colorLessonBy.value = param.colorLessonBy;
  form.visibility.value = param.visibility;
}

function removeLesson(date, time, roomName) {
  lessons = lessons.filter(
    (lesson) => !matchLessonCondition(lesson, date, time, roomName)
  );
  buildLessonListAndCalendar(lessons);
}

function highlightLesson(date, time, roomName) {
  const lesson = lessons.find((l) =>
    matchLessonCondition(l, date, time, roomName)
  );
  if (!!lesson) {
    const previousHighlight = lesson.highlight;
    // reset all
    lessons.forEach((lesson) => (lesson.highlight = false));
    // set new
    lesson.highlight = !previousHighlight;
    buildLessonListAndCalendar(lessons);
  }
}

function matchLessonCondition(lesson, date, time, roomName) {
  return (
    lesson.date === date && lesson.time === time && lesson.roomName === roomName
  );
}

function getSelectedDates(startDate, endDate) {
  let dates = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new CalendarDate(d.getDate(), d.getMonth(), d.getFullYear()));
  }
  return dates;
}
