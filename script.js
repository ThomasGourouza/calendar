const dateFormat = "Y-m-d";
flatpickr("#startDate", {
  dateFormat,
});
flatpickr("#bankHolidays", {
  mode: "multiple",
  dateFormat,
});

// dates sélectionnées
let selectedDates = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];
fillSelectOptions(
  "levels",
  levels.map((level) => level.name)
);
fillSelectOptions(
  "teachers",
  teachers.map((teacher) => teacher.name)
);
// load parameter and init form with default parameters
setForm(parameterForm, parameter);

// créer la liste des professeurs
parameterForm.onsubmit = function (e) {
  e.preventDefault();
  setParameters(this, parameter);
  selectedDates = getSelectedDates(
    parameter.startDate,
    parameter.numberDays,
    parameter.bankHolidays
  );
  buildHtmlConditions(
    teachers,
    levels.map((level) => level.name)
  );
  buildHtml();
  navigate("conditions-wrapper");
};

// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  // TODO: verifier que la lecon n'est pas en conflit avec une autre: validateLessonForm();
  // create lesson
  lessons.push(
    new Lesson(
      getLessonDate(this.date.value),
      this.teacherName.value,
      this.levelName.value
    )
  );
  this.reset();
  buildHtml();
};

// supprimer une leçon
function removeLesson(date, levelName) {
  lessons = lessons.filter((lesson) => !isLesson(lesson, date, levelName));
  buildHtml();
}

// selectionner une leçon
function highlightLesson(date, levelName) {
  const lesson = lessons.find((l) => isLesson(l, date, levelName));
  if (!!lesson) {
    const previousHighlight = lesson.highlight;
    // reset all
    lessons.forEach((lesson) => (lesson.highlight = false));
    // set new
    lesson.highlight = !previousHighlight;
    buildHtml();
  }
}

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}

// créer la liste des leçons et le calendrier
function buildHtml() {
  return buildHtmlLessonListAndCalendar(
    lessons,
    selectedDates,
    teachers,
    highlightLesson,
    removeLesson
  );
}
