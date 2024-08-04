function getDaysNumberBetween(startDate, endDate) {
  if (isNaN(startDate) || isNaN(endDate)) {
    return -1;
  }
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}

function getQuarterIdFromStartTime(timeString, minTime) {
  return getQuarterIdFromEndTime(timeString, minTime) + 1;
}

function getQuarterIdFromEndTime(timeString, minTime) {
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

function existingLesson(lessonList, date, quarterTime, roomName, minTime) {
  return lessonList.find(
    (l) =>
      l.date === date &&
      l.getQuarterIds(minTime).includes(quarterTime) &&
      l.roomName === roomName
  );
}

function isLunchTime(quarterTimeId, minTime, minLunchTime, maxLunchTime) {
  const minLunchTimeText = `${Math.floor(minLunchTime)}:${
    (minLunchTime - Math.floor(minLunchTime)) * 60
  }`;
  const maxLunchTimeText = `${Math.floor(maxLunchTime)}:${
    (maxLunchTime - Math.floor(maxLunchTime)) * 60
  }`;
  return (
    quarterTimeId >= getQuarterIdFromStartTime(minLunchTimeText, minTime) &&
    quarterTimeId <= getQuarterIdFromEndTime(maxLunchTimeText, minTime)
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

function getTimeFromQuarterId(quarterTimeId, minTime) {
  const timeNumber = minTime + (quarterTimeId - 1) / 4;
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

function getTimeTextFrom(quarterTimeId, minTime) {
  const time = getTimeFromQuarterId(quarterTimeId, minTime);
  return getTimeText(time.from.hour, time.from.minute);
}

function filterAndSort(lessonList, visibility, startDate, endDate, filters) {
  return sort(filter(lessonList, visibility, startDate, endDate, filters));
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

function filter(lessonList, visibility, startDate, endDate, filters) {
  let newLessonList = [...lessonList];
  if (visibility === "selected") {
    const minDate = new Date(startDate);
    const maxDate = new Date(endDate);
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

function fillTdWithNameAndDisk(td, name, lesson, list, colorLessonBy) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = lesson[name];
  const divDisk = putElementIn("div", wrapper);
  if (colorLessonBy === name) {
    divDisk.style.backgroundColor = list.find(
      (item) => item.name === lesson[name]
    )?.color;
  }
}

function getQuarterTimes(minTime, maxTime) {
  const quarterTimes = [];
  for (let i = 1; i <= (maxTime - minTime) * 4; i++) {
    quarterTimes.push(i);
  }
  return quarterTimes;
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
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);
  let dates = [];
  for (let d = dateFrom; d <= dateTo; d.setDate(d.getDate() + 1)) {
    dates.push(new CalendarDate(d.getDate(), d.getMonth(), d.getFullYear()));
  }
  return dates;
}

function validateCalendarForm(form) {
  const dateFrom = new Date(form.startDate.value);
  const dateTo = new Date(form.endDate.value);
  const maxDays = +form.maxDays.value;
  if (getDaysNumberBetween(dateFrom, dateTo) <= 0) {
    alert(`End date must be after the start date.`);
    return;
  }
  if (Math.abs(dateFrom - dateTo) / (1000 * 60 * 60 * 24) > maxDays - 1) {
    alert(`Not more than ${maxDays} days.`);
    return;
  }
}

function setParameters(form, param) {
  param.lang = form.lang.value;
  param.minTime = +form.minTime.value;
  param.maxTime = +form.maxTime.value;
  param.minLunchTime = +form.minLunchTime.value;
  param.maxLunchTime = +form.maxLunchTime.value;
  param.minLessonTime = +form.minLessonTime.value;
  param.maxLessonTime = +form.maxLessonTime.value;
  param.maxDays = +form.maxDays.value;
  param.colorLessonBy = form.colorLessonBy.value;
  param.visibility = form.visibility.value;
  param.startDate = form.startDate.value;
  param.endDate = form.endDate.value;
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

function validateLessonForm(
  form,
  startDate,
  endDate,
  minLessonTime,
  maxLessonTime
) {
  if (!startDate || !endDate) {
    alert("Renseignez les dates du calendrier!");
    return;
  }
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);
  dateTo.setDate(dateTo.getDate() + 1);

  const lessonDate = new Date(`${form.date.value}T${form.startTime.value}:00`);
  const lessonDateEnd = new Date(`${form.date.value}T${form.endTime.value}:00`);

  if (lessonDate < dateFrom || lessonDate > dateTo) {
    // TODO: useless ?
    alert("invalid date");
    return;
  }
  if (lessonDateEnd < lessonDate) {
    // TODO
    alert("impossible");
    return;
  }
  if (
    Math.abs(lessonDate - lessonDateEnd) < minLessonTime * 60000 ||
    Math.abs(lessonDate - lessonDateEnd) > maxLessonTime * 60000
  ) {
    // TODO
    alert(
      `lesson should last between ${minLessonTime}min and ${maxLessonTime}min.`
    );
    return;
  }
}

function getDate(date) {
  const lessonDate = new Date(date);
  return new CalendarDate(
    lessonDate.getDate(),
    lessonDate.getMonth(),
    lessonDate.getFullYear()
  ).getDate();
}
