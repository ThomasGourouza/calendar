document.addEventListener("DOMContentLoaded", function () {
  let filters = [];

  // les quarts d'heures de la journée
  let allQuarterTimes = [];

  let selectedDates = [];

  const parameter = {
    lang: "fr",
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
    parameter.lang = this.lang.value;
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
    selectedDates = getSelectedDates(startDate, endDate);
    buildLessonListAndCalendar(lessons, parameter, filters);
  };

  const addLessonForm = document.forms["addLesson-form"];
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

    const lessonDate = new Date(
      `${this.date.value}T${this.startTime.value}:00`
    );
    const lessonDateEnd = new Date(
      `${this.date.value}T${this.endTime.value}:00`
    );

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
    buildLessonListAndCalendar(lessons, parameter, filters);
    this.reset();
  };

  function buildLessonListAndCalendar(lessonList, param, filters) {
    if (!parameter.startDate || !parameter.endDate) {
      return;
    }
    buildHtmlLessonList(lessonList, param, filters);
    buildHtmlCalendar(lessonList, param, filters);
  }

  function buildHtmlLessonList(lessonList, param, filters) {
    const lessonsTbody = document.getElementById("lessons");
    const trs = lessonsTbody.querySelectorAll("tr");
    for (let i = trs.length - 1; i > 0; i--) {
      lessonsTbody.removeChild(trs[i]);
    }
    addLessonForm.date.setAttribute("min", param.startDate);
    addLessonForm.date.setAttribute("max", param.endDate);
    filterAndSort(lessonList, param, filters).forEach((lesson) => {
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
      fillTdWithNameAndDisk(teacherTd, "teacherName", lesson, teachers, param);

      const levelTd = putElementIn("td", tr);
      fillTdWithNameAndDisk(levelTd, "levelName", lesson, levels, param);

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

  function buildHtmlCalendar(lessonList, param, filters) {
    const filteredSortedList = filterAndSort(lessonList, param, filters);
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
      thDay.setAttribute("colspan", filterRooms(rooms, filters).length);
      thDay.innerHTML = selectedDate.printDate(param);

      filterRooms(rooms, filters).forEach((room) => {
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
        td.innerHTML = getTimeTextFrom(quarterTime, param);
      }
      selectedDates.forEach((selectedDate) => {
        filterRooms(rooms, filters).forEach((room) => {
          const td = putElementIn("td", tr);
          if (isLunchTime(quarterTime, param)) {
            td.className = "lunch";
          }
          const lesson = existingLesson(
            filteredSortedList,
            selectedDate.getDate(),
            quarterTime,
            room.name,
            param
          );
          if (!!lesson) {
            td.className = "booked";
            td.innerHTML = lesson.getInnerHtml(quarterTime, param);
            td.style.backgroundColor = lesson.getBackgroundColor(param);
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
    styleBorderThick(filters);
    styleColorCalendarCells(filters);
  }

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
    buildLessonListAndCalendar(lessons, parameter, filters);
  }
});
