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
let levels = [];
let teachers = [];
let lessons = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];
fillSelectOptions("levels", levelNames);
fillSelectOptions("teachers", teacherNames);
// load parameter and init form with default parameters
setForm(parameterForm, parameter);

// créer la liste des parametres pour les professeurs et les niveaux
parameterForm.onsubmit = function (e) {
  e.preventDefault();
  if (!parameterForm.startDate.value) {
    alert("Date de début!");
    return;
  }
  setParameters(this, parameter);
  selectedDates = getSelectedDates(
    parameter.startDate,
    parameter.numberDays,
    parameter.bankHolidays
  );
  const regularDates = selectedDates
    .filter((date) => date.type === "regular")
    .map((date) => date.date);
  const firstDate = regularDates[0];
  const lastDate = regularDates[regularDates.length - 1];
  teachers = teacherNames.map(
    (t, index) => new Teacher(t, parameter, colors[index % colors.length])
  );
  buildHtmlTeachersConditions(
    teachers,
    levelNames,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays
  );
  document.getElementById("levels-checkbox").checked = true;
  levels = levelNames.map((l) => new Level(l, parameter));
  buildHtmlLevelsConditions(levels);
  navigate("conditions-wrapper");
};

function selectOrUnselectAll(value) {
  levels.forEach((l) => (l.active = value));
  buildHtmlLevelsConditions(levels);
}

// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  const newLesson = new Lesson(
    getLessonDate(this.date.value),
    this.teacherName.value,
    this.levelName.value
  );
  if (existLesson(newLesson, lessons)) {
    alert(
      `Une leçon existe déjà le ${newLesson.date} pour le niveau ${newLesson.levelName}.`
    );
    return;
  }
  // create lesson
  lessons.push(newLesson);
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

function generateTeacherAndLevelConditions() {
  if (
    isValide(
      teachers.map((teacher) => teacher.workingHours),
      parameter.lessonDuration,
      parameter.numberDays
    )
  ) {
    if (levels.some((l) => l.active)) {
      buildHtmlConfirmations(
        teachers,
        levels.filter((l) => l.active),
        selectedDates
      );
      navigate("confirmation-wrapper");
    } else {
      alert("Aucun niveau sélectionné.");
      return;
    }
  } else {
    const invalidTeachers = teachers
      .filter(
        (t) =>
          !!t.workingHours.min &&
          !!t.workingHours.max &&
          +t.workingHours.min > +t.workingHours.max
      )
      .map((t) => t.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");
    alert(`Volume horaire incorrect pour ${invalidTeachers}`);
    return;
  }
}

// créer la liste des leçons et le calendrier
function generateLessonListAndBuildHtml() {
  const dates = selectedDates
    .filter((d) => d.type === "regular")
    .map((d) => getDateTextFromLocalDate(d.date));
  lessons = getLessonList(
    dates,
    teachers.map((t) => ({
      ...t,
      availabilities: t.getAvailabilities(selectedDates),
    })),
    levels.filter((l) => l.active).map((l) => ({ ...l })),
    parameter.lessonDuration
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
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

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}
