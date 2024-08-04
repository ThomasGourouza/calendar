document.addEventListener("DOMContentLoaded", function () {
  // les formulaires
  const calendarForm = document.forms["calendar-form"];
  const addLessonForm = document.forms["addLesson-form"];

  // filtre des leçons
  let lessonFilters = [];

  // les quarts d'heures de la journée
  let allQuarterTimes = [];

  // dates sélectionnées
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

  // initialiser le formulaire avec les paramètres par défault
  setForm(calendarForm, parameter);
  // créer la liste des leçons et le calendrier
  calendarForm.onsubmit = function (e) {
    e.preventDefault();
    validateCalendarForm(this);
    setParameters(this, parameter);
    allQuarterTimes = getQuarterTimes(parameter.minTime, parameter.maxTime);
    selectedDates = getSelectedDates(parameter.startDate, parameter.endDate);
    buildHtml();
  };

  // ajouter une leçon
  addLessonForm.onsubmit = function (e) {
    e.preventDefault();
    validateLessonForm(
      this,
      parameter.startDate,
      parameter.endDate,
      parameter.minLessonTime,
      parameter.maxLessonTime
    );
    // create lesson
    lessons.push(
      new Lesson(
        getDate(this.date.value),
        getTime(this.startTime.value, this.endTime.value),
        this.roomName.value,
        this.teacherName.value,
        this.levelName.value
      )
    );
    // reset filters
    lessonFilters = [];
    this.reset();
    buildHtml();
  };

  // supprimer une leçon
  function removeLesson(date, time, roomName) {
    lessons = lessons.filter(
      (lesson) => !isLessonToRemove(lesson, date, time, roomName)
    );
    buildHtml();
  }

  // selectionner une leçon
  function highlightLesson(date, time, roomName) {
    const lesson = lessons.find((l) =>
      isLessonToRemove(l, date, time, roomName)
    );
    if (!!lesson) {
      const previousHighlight = lesson.highlight;
      // reset all
      lessons.forEach((lesson) => (lesson.highlight = false));
      // set new
      lesson.highlight = !previousHighlight;
      buildHtml();
    }
  }

  // filtrer les leçons
  function filterLessons() {
    const startDateValue = parameter.startDate;
    const endDateValue = parameter.endDate;
    if (!startDateValue || !endDateValue) {
      alert("Renseignez les dates du calendrier!");
      return;
    }
    lessonFilters = [];
    ["roomName", "teacherName", "levelName"].forEach((field) => {
      const value = addLessonForm[field].value;
      if (!!value) {
        lessonFilters.push({ field, value });
      }
    });
    buildHtml();
  }

  function buildHtml() {
    return buildHtmlLessonListAndCalendar(
      addLessonForm,
      lessons,
      parameter.startDate,
      parameter.endDate,
      parameter.visibility,
      parameter.colorLessonBy,
      parameter.lang,
      parameter.minTime,
      parameter.minLunchTime,
      parameter.maxLunchTime,
      lessonFilters,
      selectedDates,
      allQuarterTimes,
      highlightLesson,
      removeLesson
    );
  }
});
