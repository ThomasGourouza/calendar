document.addEventListener("DOMContentLoaded", function () {
  let filters = [];

  // les quarts d'heures de la journée
  let allQuarterTimes = [];

  let selectedDates = [];

  // paramètres par défault
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
    visibility: "all",
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

  // formulaire des paramètres et des dates du calendrier
  const calendarForm = document.forms["calendar-form"];
  setForm(calendarForm, parameter);
  calendarForm.onsubmit = function (e) {
    e.preventDefault();
    validateCalendarForm(this);
    setParameters(this, parameter);
    allQuarterTimes = getQuarterTimes(parameter.minTime, parameter.maxTime);
    selectedDates = getSelectedDates(parameter.startDate, parameter.endDate);
    buildLessonListAndCalendar(lessons, parameter, filters);
  };

  // ajouter une leçon
  const addLessonForm = document.forms["addLesson-form"];
  addLessonForm.onsubmit = function (e) {
    e.preventDefault();
    validateLessonForm(
      this,
      parameter.startDate,
      parameter.endDate,
      parameter.minLessonTime,
      parameter.maxLessonTime
    );

    const lesson = new Lesson(
      getDate(this.date.value),
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
    filterAndSort(
      lessonList,
      param.visibility,
      param.startDate,
      param.endDate,
      filters
    ).forEach((lesson) => {
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
      fillTdWithNameAndDisk(
        teacherTd,
        "teacherName",
        lesson,
        teachers,
        param.colorLessonBy
      );

      const levelTd = putElementIn("td", tr);
      fillTdWithNameAndDisk(
        levelTd,
        "levelName",
        lesson,
        levels,
        param.colorLessonBy
      );

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
    const filteredSortedList = filterAndSort(
      lessonList,
      param.visibility,
      param.startDate,
      param.endDate,
      filters
    );
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
      thDay.innerHTML = selectedDate.printDate(param.lang);

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
        td.innerHTML = getTimeTextFrom(quarterTime, param.minTime);
      }
      selectedDates.forEach((selectedDate) => {
        filterRooms(rooms, filters).forEach((room) => {
          const td = putElementIn("td", tr);
          if (
            isLunchTime(
              quarterTime,
              param.minTime,
              param.minLunchTime,
              param.maxLunchTime
            )
          ) {
            td.className = "lunch";
          }
          const lesson = existingLesson(
            filteredSortedList,
            selectedDate.getDate(),
            quarterTime,
            room.name,
            param.minTime
          );
          if (!!lesson) {
            td.className = "booked";
            td.innerHTML = lesson.getInnerHtml(quarterTime, param.minTime);
            td.style.backgroundColor = lesson.getBackgroundColor(
              param.colorLessonBy
            );
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
