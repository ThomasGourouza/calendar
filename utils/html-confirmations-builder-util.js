function buildHtmlConfirmations(
  teachers,
  levels,
  selectedDates,
  numberDays,
  lessonDuration
) {
  buildHtmlTeachersConfirmations(
    teachers,
    selectedDates,
    numberDays,
    lessonDuration
  );
  buildHtmlLevelsConfirmations(levels);
}

function buildHtmlTeachersConfirmations(
  teachers,
  selectedDates,
  numberDays,
  lessonDuration
) {
  const regularTimes = selectedDates
    .filter((date) => date.type === "regular")
    .map((date) => date.date.getTime());
  const div = document.getElementById("teachers-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  teachers.forEach((teacher) => {
    const li = putElementIn("li", ul);
    li.className = "main-teacher";
    li.innerHTML = `${teacher.name}:`;
    const ul2 = putElementIn("ul", li);
    const li2 = putElementIn("li", ul2);
    li2.innerHTML = `Disponible ${
      teacher.getAvailabilities(selectedDates).length
    } jours.`;
    if (teacher.recurrentDaysOff.length > 0) {
      const recurrentDaysOffText = teacher.recurrentDaysOff
        .map((d) => getDayText(+d))
        .join(", ")
        .replace(/, ([^,]*)$/, " et $1");
      const li3 = putElementIn("li", ul2);
      li3.innerHTML = `Indispo. récurrente: ${recurrentDaysOffText}.`;
    }
    const daysOffFiltered = teacher.daysOff.filter(
      (d) =>
        !teacher.recurrentDaysOff
          .map((d) => +d)
          .includes(new Date(d).getDay()) &&
        regularTimes.includes(new Date(d).getTime())
    );
    if (daysOffFiltered.length > 0) {
      const daysOffText = daysOffFiltered
        .map((date) => printDateFull(new Date(date)))
        .join(", ")
        .replace(/, ([^,]*)$/, " et $1");
      const li4 = putElementIn("li", ul2);
      li4.innerHTML = `Congés: ${daysOffText}.`;
    }
    const li5 = putElementIn("li", ul2);
    li5.innerHTML = confirmHours(
      teacher.workingHours,
      numberDays,
      lessonDuration
    );
    const li6 = putElementIn("li", ul2);
    if (teacher.preferedLevelNames.length > 0) {
      li6.innerHTML = `Niveaux préférés: ${teacher.preferedLevelNames
        .join(", ")
        .replace(/, ([^,]*)$/, " et $1")}.`;
    } else {
      li6.innerHTML = "Sans préférence de niveau.";
    }
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
    li.className = "main";
    li.innerHTML = `${level.name}`;
  });
}

function confirmHours(workingHours, numberDays, minHour) {
  const maxHours = numberDays * minHour;
  if (+workingHours.min === minHour && +workingHours.max === maxHours) {
    return "Volume horaire indéterminé.";
  }
  if (+workingHours.min === +workingHours.max) {
    return `Volume horaire d'exactement ${+workingHours.min}h.`;
  }
  if (+workingHours.min > minHour && +workingHours.max === maxHours) {
    return `Volume horaire minimum de ${+workingHours.min}h.`;
  }
  if (+workingHours.min === minHour && +workingHours.max < maxHours) {
    return `Volume horaire maximum de ${+workingHours.max}h.`;
  }
  if (+workingHours.min > minHour && +workingHours.max < maxHours) {
    return `Volume horaire compris entre ${+workingHours.min}h et ${+workingHours.max}h.`;
  }
  return "";
}
