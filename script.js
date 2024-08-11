// dates sélectionnées
let selectedDates = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];
fillSelectOptions(
  "levels",
  levels
);
fillSelectOptions(
  "teachers",
  teachers.map((teacher) => teacher.name)
);
// load parameter and init form with default parameters
setForm(parameterForm, parameter);

// créer la liste des leçons et le calendrier
// see calendar: parameterForm.onsubmit = function (e) {
// see calendar:   e.preventDefault();
// see calendar:   setParameters(this, parameter);
  selectedDates = getSelectedDates(parameter.startDate, parameter.numberDays);
  buildHtml();
  navigate("lessons-calendar-wrapper");
// see calendar: };

// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  // TODO: verifier que la lecon n'est pas en conflit avec une autre: validateLessonForm();
  // create lesson
  lessons.push(
    new Lesson(
      getLessonDate(this.date.value),
      this.teacherName.value,
      this.level.value
    )
  );
  this.reset();
  buildHtml();
};

// supprimer une leçon
function removeLesson(date) {
  lessons = lessons.filter(
    (lesson) => !isLessonToRemove(lesson, date)
  );
  buildHtml();
}

// selectionner une leçon
function highlightLesson(date) {
  const lesson = lessons.find((l) => isLessonToRemove(l, date));
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

function buildHtml() {
  return buildHtmlLessonListAndCalendar(
    lessons,
    selectedDates,
    levels,
    highlightLesson,
    removeLesson
  );
}
