function buildHtmlConfirmations(teacherConditions, levels) {
  buildHtmlTeachersConfirmations(teacherConditions);
  buildHtmlLevelsConfirmations(levels);
}

function buildHtmlTeachersConfirmations(teacherConditions) {
  const div = document.getElementById("teachers-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  teacherConditions.forEach((teacherCondition) => {
    const p = putElementIn("p", div);
    p.innerHTML = `${teacherCondition.name} est disponible le`;
  });
}

function buildHtmlLevelsConfirmations(levels) {
  const div = document.getElementById("levels-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  levels.forEach((level) => {
    const p = putElementIn("p", div);
    p.innerHTML = `${1111}`;
  });
}
