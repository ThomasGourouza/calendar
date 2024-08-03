const lang = "fr";

// les quarts d'heures de la journée
const allQuarterTimes = [];
for (let i = 1; i <= (parameter.maxTime - parameter.minTime) * 4; i++) {
  allQuarterTimes.push(i);
}

document.addEventListener("DOMContentLoaded", function () {
  // fill options in html template
  fillSelectOptions("roomNames", rooms.map(room => room.name));
  fillSelectOptions("levelNames", levels.map(level => level.name));
  fillSelectOptions("teacherNames", teachers.map(teacher => teacher.name));

  buildLessonList();
});

document.forms["calendarForm"].onsubmit = function (e) {
  e.preventDefault();
  const startDate = new Date(this.startDate.value);
  const endDate = new Date(this.endDate.value);

  if (getDaysNumberBetween(startDate, endDate) <= 0) {
    alert(`End date must be after the start date.`);
  } else {
    fillSelectedDates(startDate, endDate);
    buildCalendar();
  }
};

document.forms["addLessonForm"].onsubmit = function (e) {
  e.preventDefault();
  const lessonDate = new Date(this.date.value);
  const calendarDate = new CalendarDate(
    lessonDate.getDate(),
    lessonDate.getMonth(),
    lessonDate.getFullYear()
  );

  // const startTimeId = getQuarterIdFromStartTime(this.startTime.value);
  // const endTimeId = getQuarterIdFromEndTime(this.endTime.value);
  // const quarterTimes = [];
  // for (let i = startTimeId; i <= endTimeId; i++) {
  //   quarterTimes.push(i);
  // }

  const lesson = new Lesson(
    calendarDate.getDate(),
    getTime(this.startTime.value, this.endTime.value),
    this.roomName.value,
    this.teacherName.value,
    this.levelName.value
  );

  lessons.push(lesson);
  buildLessonList();
  buildCalendar();
  this.reset();
};

function removeLesson(date, time, roomName) {
  lessons = lessons.filter(
    (lesson) =>
      lesson.date !== date || lesson.time !== time || lesson.roomName !== roomName
  );
  buildLessonList();
  buildCalendar();
}

function fillSelectedDates(startDate, endDate) {
  selectedDates = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    selectedDates.push(
      new CalendarDate(d.getDate(), d.getMonth(), d.getFullYear())
    );
  }
}

function buildCalendar() {
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
    thDay.setAttribute("colspan", rooms.length);
    thDay.innerHTML = selectedDate.printDate();

    rooms.forEach((room) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = room.name;
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
      rooms.forEach((room) => {
        const td = putElementIn("td", tr);
        checkLunchTime(td, quarterTime);
        const lesson = checkLesson(selectedDate.getDate(), quarterTime, room.name);
        if (!!lesson) {
          td.className = "booked";
          td.innerHTML = lesson.innerHtml(quarterTime);
          td.setAttribute("title", lesson.title);
        }
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
    const removeButtonDiv = putElementIn("div", removeButtonTd);
    removeButtonDiv.className = "button";
    removeButtonDiv.onclick = () => {
      removeLesson(lesson.date, lesson.time, lesson.roomName);
    };
    removeButtonDiv.innerHTML = "-";
  });
}
