const lang = "fr";

let filters = [];

// les quarts d'heures de la journée
let allQuarterTimes = [];

const parameter = {
  // lang: "fr",
  minTime: 8,
  maxTime: 20,
  minLunchTime: 12,
  maxLunchTime: 14,
  minLessonTime: 30,
  maxLessonTime: 120,
  maxDays: 20,
  colorLessonBy: "teacherName",
  visibility: "selected",
  startDate: "",
  endDate: "",
};

const calendarForm = document.forms["calendar-form"];
// paramètres par défault
setForm(calendarForm, parameter);

calendarForm.onsubmit = function (e) {
  e.preventDefault();

  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);
  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    alert(`End date must be after the start date.`);
    return;
  }
  if (
    Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24) >
    parameter.maxDays - 1
  ) {
    alert(`Not more than ${parameter.maxDays} days.`);
    return;
  }
  parameter.minTime = +this.minTime.value;
  parameter.maxTime = +this.maxTime.value;
  parameter.minLunchTime = +this.minLunchTime.value;
  parameter.maxLunchTime = +this.maxLunchTime.value;
  parameter.minLessonTime = +this.minLessonTime.value;
  parameter.maxLessonTime = +this.maxLessonTime.value;
  parameter.maxDays = +this.maxDays.value;
  parameter.colorLessonBy = this.colorLessonBy.value;
  parameter.visibility = this.visibility.value;
  parameter.startDate = this.startDate.value;
  parameter.endDate = this.endDate.value;

  allQuarterTimes = getQuarterTimes(parameter);
  fillSelectedDates(startDate, endDate);
  buildLessonListAndCalendar(lessons);
};

const addLessonForm = document.forms["addLessonForm"];
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  const startDateValue = parameter.startDate;
  const endDateValue = parameter.endDate;
  if (!startDateValue || !endDateValue) {
    alert("Renseignez les dates du calendrier!");
    return;
  }
  const minDate = new Date(startDateValue);
  const maxDate = new Date(endDateValue);
  maxDate.setDate(maxDate.getDate() + 1);

  const lessonDate = new Date(`${this.date.value}T${this.startTime.value}:00`);
  const lessonDateEnd = new Date(`${this.date.value}T${this.endTime.value}:00`);

  if (lessonDate < minDate || lessonDate > maxDate) {
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
    Math.abs(lessonDate - lessonDateEnd) < parameter.minLessonTime * 60000 ||
    Math.abs(lessonDate - lessonDateEnd) > parameter.maxLessonTime * 60000
  ) {
    // TODO
    alert(
      `lesson should last between ${parameter.minLessonTime}min and ${parameter.maxLessonTime}min.`
    );
    return;
  }
  const calendarDate = new CalendarDate(
    lessonDate.getDate(),
    lessonDate.getMonth(),
    lessonDate.getFullYear()
  );

  const lesson = new Lesson(
    calendarDate.getDate(),
    getTime(this.startTime.value, this.endTime.value),
    this.roomName.value,
    this.teacherName.value,
    this.levelName.value
  );

  lessons.push(lesson);
  filters = [];
  buildLessonListAndCalendar(lessons);
  this.reset();
};

document.addEventListener("DOMContentLoaded", function () {
  // fill options in html template
  fillSelectOptions(
    "roomNames",
    rooms.map((room) => room.name)
  );
  fillSelectOptions(
    "levelNames",
    levels.map((level) => level.name)
  );
  fillSelectOptions(
    "teacherNames",
    teachers.map((teacher) => teacher.name)
  );
  buildLessonListAndCalendar(lessons);
});

function filterLessons() {
  const startDateValue = parameter.startDate;
  const endDateValue = parameter.endDate;
  if (!startDateValue || !endDateValue) {
    alert("Renseignez les dates du calendrier!");
    return;
  }
  filters = [];
  ["roomName", "teacherName", "levelName"].forEach((field) => {
    const value = addLessonForm[field].value;
    if (!!value) {
      filters.push({ field, value });
    }
  });
  buildLessonListAndCalendar(lessons);
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

function fillSelectedDates(startDate, endDate) {
  selectedDates = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    selectedDates.push(
      new CalendarDate(d.getDate(), d.getMonth(), d.getFullYear())
    );
  }
}

function buildCalendar(lessonList) {
  if (selectedDates.length === 0) {
    return;
  }
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  const h2 = putElementIn("h2", wrapper);
  h2.innerHTML = "Calendrier";
  const table = putElementIn("table", wrapper);
  table.className = "calendar";
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);

  const thTitle = putElementIn("th", tr1);
  thTitle.setAttribute("rowspan", 2);

  // Headers jours et salles
  selectedDates.forEach((selectedDate) => {
    const thDay = putElementIn("th", tr1);
    thDay.setAttribute("colspan", filterRooms(rooms).length);
    thDay.innerHTML = selectedDate.printDate();

    filterRooms(rooms).forEach((room) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = room.name;
      thRoom.style.backgroundColor = room.color;
    });
  });

  // Contenu du calendrier
  allQuarterTimes.forEach((quarterTime) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    if ([1, 3].includes(quarterTime % 4)) {
      td.innerHTML = getTimeTextFrom(quarterTime);
    }
    selectedDates.forEach((selectedDate) => {
      filterRooms(rooms).forEach((room) => {
        const td = putElementIn("td", tr);
        if (isLunchTime(quarterTime)) {
          td.className = "lunch";
        }
        const lesson = existingLesson(
          lessonList,
          selectedDate.getDate(),
          quarterTime,
          room.name
        );
        if (!!lesson) {
          td.className = "booked";
          td.innerHTML = lesson.innerHtml(quarterTime);
          td.style.backgroundColor = lesson.backgroundColor;
          if (lesson.highlight) {
            td.classList.add("highlighted-lesson");
          }
          td.setAttribute("title", lesson.title);
          td.onclick = () => {
            highlightLesson(lesson.date, lesson.time, lesson.roomName);
          };
        }
      });
    });
  });
  styleBorderThick();
  styleColorCells();
}

function buildLessonList(lessonList) {
  const minDate = parameter.startDate;
  const maxDate = parameter.endDate;
  if (!minDate || !maxDate) {
    return;
  }
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");
  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }
  addLessonForm.date.setAttribute("min", minDate);
  addLessonForm.date.setAttribute("max", maxDate);
  filterAndSort(lessonList).forEach((lesson) => {
    const tr = putElementIn("tr", lessonsTbody);
    if (lesson.highlight) {
      tr.className = "highlightedRow";
    }
    tr.onclick = () => {
      highlightLesson(lesson.date, lesson.time, lesson.roomName);
    };

    const dateTd = putElementIn("td", tr);
    dateTd.innerHTML = lesson.printDate();

    const timeFromTd = putElementIn("td", tr);
    timeFromTd.innerHTML = lesson.printTimeFrom();

    const timeToTd = putElementIn("td", tr);
    timeToTd.innerHTML = lesson.printTimeTo();

    const roomTd = putElementIn("td", tr);
    roomTd.innerHTML = lesson.roomName;

    const teacherTd = putElementIn("td", tr);
    fillTdWithNameAndDisk(teacherTd, "teacherName", lesson, teachers);

    const levelTd = putElementIn("td", tr);
    fillTdWithNameAndDisk(levelTd, "levelName", lesson, levels);

    const removeButtonTd = putElementIn("td", tr);
    removeButtonTd.setAttribute("colspan", 2);
    if (lesson.highlight) {
      const removeButton = putElementIn("div", removeButtonTd);
      removeButton.className = "button";
      removeButton.onclick = () => {
        removeLesson(lesson.date, lesson.time, lesson.roomName);
      };
      removeButton.innerHTML = "-";
    }
  });
}

function buildLessonListAndCalendar(lessonList) {
  buildLessonList(lessonList);
  buildCalendar(filterAndSort(lessonList));
}
