function buildHtmlConfirmations(teachers, levels, selectedDates) {
  buildHtmlTeachersConfirmations(teachers, selectedDates);
  buildHtmlLevelsConfirmations(levels);
}

function buildHtmlTeachersConfirmations(teachers, selectedDates) {
  const div = document.getElementById("teachers-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  teachers.forEach((teacher) => {
    const li = putElementIn("li", ul);
    li.innerHTML = `${teacher.name} est disponible ${
      teacher.getAvailabilities(selectedDates).length
    } jours, pour ${confirmHours(
      teacher.workingHours
    )} et ${levelsToString(teacher.preferedLevelNames)}.`;
  });
}

function buildHtmlLevelsConfirmations(levels) {
  const div = document.getElementById("levels-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  levels.forEach((level) => {
    const li = putElementIn("li", ul);
    li.innerHTML = `Le niveau ${level.name} possède ${level.hours}h.`;
  });
}

function confirmHours(workingHours) {
  if (!workingHours.min && !workingHours.max) {
    return "un volume horaire indéterminé";
  }
  if (!!workingHours.min && !workingHours.max) {
    return `un volume horaire minimum de ${workingHours.min}h`;
  }
  if (!workingHours.min && !!workingHours.max) {
    return `un volume horaire maximum de ${workingHours.max}h`;
  }
  if (!!workingHours.min && !!workingHours.max) {
    if (workingHours.min === workingHours.max) {
      return `un volume horaire d'exactement ${workingHours.min}h`;
    }
    return `un volume horaire compris entre ${workingHours.min}h et ${workingHours.max}h`;
  }
  return "";
}

function levelsToString(preferedLevelNames) {
  switch (preferedLevelNames.length) {
    case 0:
      return "sans préférence de niveau";
    case 1:
      return `de préférence pour le niveau ${preferedLevelNames[0]}`;
    default:
      const lastLevel = preferedLevelNames.pop();
      return `de préférence pour les niveaux ${preferedLevelNames.join(
        ", "
      )} et ${lastLevel}`;
  }
}
