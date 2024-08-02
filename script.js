const lang = "fr";

let calendarItems = [];

// les quarts d'heures de la journée
const allQuarterTimes = [];
for (let i = 1; i <= (maxTime - minTime) * 4; i++) {
  allQuarterTimes.push(new QuarterTime(i));
}

document.addEventListener("DOMContentLoaded", function () {
  // fill options in html template
  fillSelectOptions("rooms", rooms);
  fillSelectOptions("levels", levels);
  fillSelectOptions("teachers", teachers);

  buildLessonList();
});

document.forms["calendarForm"].onsubmit = function (e) {
  e.preventDefault();
  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);

  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    alert(`End date must be after the start date.`);
  } else {
    fillCalendarItems(startDate, endDate);
    buildCalendar();
  }
};

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
  buildLessonList();
  buildCalendar();
  this.reset();
};

function removeLesson(date, month, year, startTime, room) {
  lessons = lessons.filter(
    (lesson) =>
      lesson.calendarItemDate.date !== date ||
      lesson.calendarItemDate.month !== month ||
      lesson.calendarItemDate.year !== year ||
      lesson.quarterTimes[0] !== startTime ||
      lesson.room !== room
  );
  buildLessonList();
  buildCalendar();
}

function fillCalendarItems(startDate, endDate) {
  calendarItems = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    calendarItems.push(
      new CalendarItemDate(d.getDate(), d.getMonth(), d.getFullYear())
    );
  }
}

function buildCalendar() {
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

  // Headers jours et salles
  calendarItems.forEach((item) => {
    const thDay = putElementIn("th", tr1);
    thDay.setAttribute("colspan", rooms.length);
    thDay.innerHTML = item.printDate();

    rooms.forEach((name) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = name;
    });
  });

  // Contenu du calendrier
  allQuarterTimes.forEach((quarterTime) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    if ([1, 3].includes(quarterTime.number % 4)) {
      td.innerHTML = quarterTime.getTimeTextFrom();
    }
    calendarItems.forEach((calendarItem) => {
      rooms.forEach((room) => {
          const td = putElementIn("td", tr);
          checkLunchTime(td, quarterTime.number);
          checkLesson(td, quarterTime, calendarItem, room);
        });
    });
  });
  styleBorderThick();
  styleColorCells();
}

function buildLessonList() {
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
