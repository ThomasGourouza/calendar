const lang = "fr";

// TODO: form dans le tableau des lessons (ajouter une action)
let filters = [];

function filterLessons() {
  const form = document.forms["addLessonForm"];
  filters = [];
  ["roomName", "teacherName", "levelName"].forEach((field) => {
    const value = form[field].value;
    if (!!value) {
      filters.push({ field, value });
    }
  });
  buildLessonListAndCalendar(lessons);
}

// les quarts d'heures de la journée
const allQuarterTimes = [];
for (let i = 1; i <= (parameter.maxTime - parameter.minTime) * 4; i++) {
  allQuarterTimes.push(i);
}

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

document.forms["calendarForm"].onsubmit = function (e) {
  e.preventDefault();
  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);

  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    alert(`End date must be after the start date.`);
  } else {
    fillSelectedDates(startDate, endDate);
    buildLessonListAndCalendar(lessons);
  }
};

// console.log(document.forms["addLessonForm"].date.value);
// console.log(document.forms["calendarForm"].startDate.value);

document.forms["addLessonForm"].onsubmit = function (e) {
  e.preventDefault();
  const minDate = new Date (document.forms["calendarForm"].startDate.value);
  const maxDate = new Date (document.forms["calendarForm"].endDate.value);
  maxDate.setDate(maxDate.getDate() + 1);

  const lessonDate = new Date(`${this.date.value}T${this.startTime.value}:00`);
  const lessonDateEnd = new Date(`${this.date.value}T${this.endTime.value}:00`);

  if(lessonDate < minDate || lessonDate > maxDate) {
    alert("invalid date");
    return;
  }
  if(lessonDateEnd < lessonDate) {
    alert("impossible");
    return;
  }
  const minLessonTime = 15;
  if(Math.abs(lessonDate - lessonDateEnd) < minLessonTime * 60000) {
    alert(`lesson should be longer than ${minLessonTime}min.`);
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
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");
  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }
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
    teacherTd.innerHTML = lesson.teacherName;

    const levelTd = putElementIn("td", tr);
    levelTd.innerHTML = lesson.levelName;

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
