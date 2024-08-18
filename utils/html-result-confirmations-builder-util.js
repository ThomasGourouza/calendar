function buildHtmlResultConfirmations(
  teachers,
  levels,
  selectedDates,
  numberDays,
  lessonDuration,
  lessons
) {
  // Vérifie les heures de cours pour chaque niveau
  const lessonLevelNames = lessons.map((l) => l.levelName);
  const lessonLevelMap = lessonLevelNames.reduce((acc, levelName) => {
    acc[levelName] = (acc[levelName] || 0) + 1;
    return acc;
  }, {});
  const lessonLevelDone = Object.keys(lessonLevelMap).map((level) => {
    return { name: level, hours: +lessonLevelMap[level] * lessonDuration };
  });
  const lessonLevelResults = levels.map((l) => ({
    name: l.name,
    remainingHours:
      l.hours - (lessonLevelDone.find((r) => r.name === l.name)?.hours ?? 0),
  }));

  // console.log(lessons);

  buildHtmlResultTeachersConfirmations(
    teachers,
    selectedDates,
    numberDays,
    lessonDuration
  );
  buildHtmlResultLevelsConfirmations(lessonLevelResults);
}

function buildHtmlResultTeachersConfirmations(
  teachers,
  selectedDates,
  numberDays,
  lessonDuration
) {
  const regularTimes = selectedDates
    .filter((date) => date.type === "regular")
    .map((date) => date.date.getTime());
  const div = document.getElementById("teachers-result-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  teachers.forEach((teacher) => {
    const li = putElementIn("li", ul);
    li.innerHTML = `${teacher.name}:`;
    const ul2 = putElementIn("ul", li);
    const li2 = putElementIn("li", ul2);
    li2.innerHTML = `disponible ${
      teacher.getAvailabilities(selectedDates).length
    } jours.`;
    if (teacher.recurrentDaysOff.length > 0) {
      const recurrentDaysOffText = teacher.recurrentDaysOff
        .map((d) => getDayText(+d))
        .join(", ")
        .replace(/, ([^,]*)$/, " et $1");
      const li3 = putElementIn("li", ul2);
      li3.innerHTML = `indispo. récurrente: ${recurrentDaysOffText}.`;
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
      li4.innerHTML = `congés: ${daysOffText}.`;
    }
    const li5 = putElementIn("li", ul2);
    li5.innerHTML = confirmResultHours(
      teacher.workingHours,
      numberDays,
      lessonDuration
    );
    if (teacher.preferedLevelNames.length > 0) {
      const li6 = putElementIn("li", ul2);
      li6.innerHTML = `niveaux préférés: ${teacher.preferedLevelNames
        .join(", ")
        .replace(/, ([^,]*)$/, " et $1")}.`;
    }
  });
}

function buildHtmlResultLevelsConfirmations(lessonLevelResults) {
  const div = document.getElementById("levels-result-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  lessonLevelResults.forEach((level) => {
    const li = putElementIn("li", ul);
    const message =
      level.remainingHours === 0
        ? "Toutes les heures ont été placées."
        : `Il reste ${level.remainingHours}h à placer.`;
    li.innerHTML = `${level.name}: ${message}`;
  });
}

function confirmResultHours(workingHours, numberDays, minHour) {
  const maxHours = numberDays * minHour;
  if (+workingHours.min === minHour && +workingHours.max === maxHours) {
    return "volume horaire indéterminé.";
  }
  if (+workingHours.min === +workingHours.max) {
    return `volume horaire d'exactement ${+workingHours.min}h.`;
  }
  if (+workingHours.min > minHour && +workingHours.max === maxHours) {
    return `volume horaire minimum de ${+workingHours.min}h.`;
  }
  if (+workingHours.min === minHour && +workingHours.max < maxHours) {
    return `volume horaire maximum de ${+workingHours.max}h.`;
  }
  if (+workingHours.min > minHour && +workingHours.max < maxHours) {
    return `volume horaire compris entre ${+workingHours.min}h et ${+workingHours.max}h.`;
  }
  return "";
}
