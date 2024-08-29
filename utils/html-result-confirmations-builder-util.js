function buildHtmlResultConfirmations(
  teachers,
  levels,
  selectedDates,
  numberDays,
  lessonDuration,
  lessons,
  openDays
) {
  const lessonLevelNames = [...new Set(lessons.map((l) => l.levelName))];
  const groupedTeachers = getGroupedTeachers(lessons);
  const teacherResults = getTeacherResults(
    teachers,
    selectedDates,
    numberDays,
    lessonDuration,
    lessonLevelNames,
    groupedTeachers,
    openDays
  );
  const score = getScore(teacherResults, teachers, groupedTeachers, lessonDuration);
  buildHtmlResultTeachersConfirmations(
    teacherResults.workingTeachers,
    teacherResults.notWorkingTeachers,
    score
  );
  buildHtmlResultLevelsConfirmations(levels, lessons, lessonDuration);
}

function getTeacherResults(
  teachers,
  selectedDates,
  numberDays,
  lessonDuration,
  lessonLevelNames,
  groupedTeachers,
  openDays
) {
  const workingTeachers = Object.keys(groupedTeachers);
  const notWorkingTeachers = teachers
    .map((t) => t.name)
    .filter((t) => !workingTeachers.includes(t));
  const teacherResults = Object.keys(groupedTeachers).map((teacherName) => {
    const workingDates = groupedTeachers[teacherName].map(
      (i) => new Date(toDateInput(i.date))
    );
    const dates = selectedDates
      .filter((d) => d.type === "regular")
      .map((d) => d.date);
    const actualLevelNames = [
      ...new Set(groupedTeachers[teacherName].map((i) => i.levelName)),
    ];
    const actualLevelNamesText = actualLevelNames
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");
    const currentTeacher = teachers.find((t) => t.name === teacherName);
    const recurrentDaysOff =
      currentTeacher?.recurrentDaysOff?.map((d) => +d) || [];
    const recurrentDaysOffDates = dates.filter((d) =>
      recurrentDaysOff.includes(d.getDay())
    );
    const workingHours = currentTeacher?.workingHours;
    const daysOff = (
      currentTeacher
        ?.getPeriodDaysOff(selectedDates)
        ?.map((d) => new Date(d)) || []
    ).filter(
      (d) =>
        !recurrentDaysOffDates.map((r) => r.getTime()).includes(d.getTime())
    ).sort((a, b) => a - b);
    const preferedLevelNames =
      currentTeacher?.preferedLevelNames.filter((n) =>
        lessonLevelNames.includes(n)
      ) || [];
    const preferedLevelNamesText = preferedLevelNames
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");

    let preferedText =
      preferedLevelNames.length > 0
        ? `Niveaux préférés: ${preferedLevelNamesText}.`
        : "Sans préférence de niveau.";
    const actualText =
      actualLevelNames.length > 0
        ? `Travaille avec ${actualLevelNamesText}.`
        : "Aucun niveau.";
    const levelResultText = `${preferedText} ${actualText}`;

    let levelResultColor = "red";
    if (preferedLevelNames.length > 0) {
      if (actualLevelNames.length > 0) {
        if (actualLevelNames.every((l) => preferedLevelNames.includes(l))) {
          levelResultColor = "green";
        } else if (
          actualLevelNames.some((l) => preferedLevelNames.includes(l))
        ) {
          levelResultColor = "orange";
        }
      }
    } else {
      if (actualLevelNames.length > 0) {
        levelResultColor = "green";
      }
    }
    return {
      teacherName,
      numberWorkingDays: currentTeacher.getAvailabilities(selectedDates).length,
      hours: confirmResultHours(
        workingHours,
        numberDays,
        lessonDuration,
        workingDates.length * lessonDuration
      ),
      levels: {
        text: levelResultText,
        color: levelResultColor,
      },
      recurrentDaysOff: {
        true: recurrentDaysOff.filter(
          (day) => openDays.filter(d => d.active).map(d => d.day).includes(day)
        ).length > 0,
        text: recurrentDaysOff
          .map((d) => getDayText(d))
          .join(", ")
          .replace(/, ([^,]*)$/, " et $1"),
        workDuringTimeOff: workHolidays(
          workingDates.filter((d) =>
            recurrentDaysOffDates.map((o) => o.getTime()).includes(d.getTime())
          )
        ),
      },
      daysOff: {
        true: daysOff.length > 0,
        text: daysOff
          .map((d) => printDateFull(d))
          .join(", ")
          .replace(/, ([^,]*)$/, " et $1"),
        workDuringTimeOff: workHolidays(
          workingDates.filter((d) =>
            daysOff.map((o) => o.getTime()).includes(d.getTime())
          )
        ),
      },
    };
  });
  return {
    workingTeachers: teacherResults,
    notWorkingTeachers,
  };
}

function buildHtmlResultTeachersConfirmations(
  teacherResults,
  notWorkingTeachers,
  score
) {
  const span = document.getElementById("score");
  const problem = score.problemNumber > 0 ? `(${score.problemNumber} problème${score.problemNumber > 1 ? "s" : ""}).` : "";
  span.innerHTML = `Score: ${score.score}% ${problem}`;
  span.style.color = score.score < 100 ? "red" : "green";
  const div = document.getElementById("teachers-result-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  ul.className = "teachers-ul";
  teacherResults.forEach((teacher) => {
    const li = putElementIn("li", ul);
    li.className = "main-teacher";
    li.innerHTML = `${teacher.teacherName}:`;
    const ul2 = putElementIn("ul", li);
    ul2.className = "info";

    const li2 = putElementIn("li", ul2);
    li2.innerHTML = `Disponible ${teacher.numberWorkingDays} jour${
      +teacher.numberWorkingDays > 0 ? "s" : ""
    }.`;
    li2.style.color = "green";

    if (teacher.recurrentDaysOff.true) {
      const li3 = putElementIn("li", ul2);
      li3.innerHTML = `Indispo. récurrente: ${teacher.recurrentDaysOff.text}. `;
      li3.style.color = "green";
      if (teacher.recurrentDaysOff.workDuringTimeOff.true) {
        const span = putElementIn("span", li3);
        span.innerHTML = teacher.recurrentDaysOff.workDuringTimeOff.text;
        li3.style.color = "red";
      }
    }
    if (teacher.daysOff.true) {
      const li4 = putElementIn("li", ul2);
      li4.innerHTML = `Congés: ${teacher.daysOff.text}. `;
      li4.style.color = "green";
      if (teacher.daysOff.workDuringTimeOff.true) {
        const span2 = putElementIn("span", li4);
        span2.innerHTML = teacher.daysOff.workDuringTimeOff.text;
        li4.style.color = "red";
      }
    }

    const li5 = putElementIn("li", ul2);
    li5.innerHTML = `${teacher.hours.text}`;
    li5.style.color = teacher.hours.color;

    const li6 = putElementIn("li", ul2);
    li6.innerHTML = `${teacher.levels.text}`;
    li6.style.color = teacher.levels.color;
  });
  if (notWorkingTeachers.length > 0) {
    notWorkingTeachers.forEach((teacher) => {
      const li = putElementIn("li", ul);
      li.className = "main-teacher";
      li.innerHTML = `${teacher}: `;
      const span = putElementIn("span", li);
      span.innerHTML = "Ne travaille pas.";
      span.style.color = "red";
    });
  }
}

function buildHtmlResultLevelsConfirmations(levels, lessons, lessonDuration) {
  const levelsHoursNumbers = Object.entries(
    lessons
      .map((l) => l.levelName)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {})
  ).map(([name, number]) => ({ name, number }));
  const resultLevels = levels.map((l) => {
    const numberDays = levelsHoursNumbers.find(
      (d) => d.name === l.name
    )?.number;
    const totalHours = numberDays * lessonDuration;
    return {
      name: l.name,
      hours: l.hours,
      remainingHours: l.hours - totalHours,
    };
  });
  const div = document.getElementById("levels-result-confirmation");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  const ul = putElementIn("ul", div);
  ul.className = "levels-ul";
  resultLevels.forEach((level) => {
    const li = putElementIn("li", ul);
    li.className = "main";
    const message =
      level.remainingHours === 0
        ? "Aucune heure restante."
        : `Il reste ${level.remainingHours}h à placer.`;
    li.innerHTML = `${level.name}: `;
    const span = putElementIn("span", li);
    span.innerHTML = message;
    span.style.color = level.remainingHours > 0 ? "red" : "green";
  });
}

function confirmResultHours(workingHours, numberDays, minHour, actualHours) {
  const maxHours = numberDays * minHour;
  let timeMode = "";
  const result = {
    text: "",
    color: "red",
  };
  if (+workingHours.min === minHour && +workingHours.max === maxHours) {
    timeMode = "Volume horaire indéterminé:";
    result.text = `${timeMode} Travaille ${actualHours}h.`;
    result.color = "green";
  } else if (+workingHours.min === +workingHours.max) {
    timeMode = `Volume horaire d'exactement ${+workingHours.min}h:`;
    result.text = `${timeMode} Travaille ${actualHours}h.`;
    if (+actualHours === +workingHours.min) {
      result.color = "green";
    }
  } else if (+workingHours.min > minHour && +workingHours.max === maxHours) {
    timeMode = `Volume horaire minimum de ${+workingHours.min}h:`;
    result.text = `${timeMode} Travaille ${actualHours}h.`;
    if (+actualHours >= +workingHours.min) {
      result.color = "green";
    }
  } else if (+workingHours.min === minHour && +workingHours.max < maxHours) {
    timeMode = `Volume horaire maximum de ${+workingHours.max}h:`;
    result.text = `${timeMode} Travaille ${actualHours}h.`;
    if (+actualHours <= +workingHours.max) {
      result.color = "green";
    }
  } else if (+workingHours.min > minHour && +workingHours.max < maxHours) {
    timeMode = `Volume horaire compris entre ${+workingHours.min}h et ${+workingHours.max}h:`;
    result.text = `${timeMode} Travaille ${actualHours}h.`;
    if (
      +actualHours >= +workingHours.min &&
      +actualHours <= +workingHours.max
    ) {
      result.color = "green";
    }
  }
  return result;
}

function workHolidays(dates) {
  const result = {
    true: dates.length > 0,
    text: "",
  };
  if (result.true) {
    result.text = `Mais travaille ${dates
      .map((d) => printDateFull(d))
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1")}.`;
  }
  return result;
}
