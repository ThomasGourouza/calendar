const weekDays = [
  { name: "Lundi", index: "1" },
  { name: "Mardi", index: "2" },
  { name: "Mercredi", index: "3" },
  { name: "Jeudi", index: "4" },
  { name: "Vendredi", index: "5" },
];

function buildHtmlTeachersConditions(
  teachers,
  levelNames,
  startDate,
  endDate,
  lessonDuration,
  numberDays
) {
  Array.from(document.getElementsByClassName("date-indication")).forEach(
    (dateIndication) =>
      (dateIndication.innerHTML = `<ul><li>La période va du ${startDate} au ${endDate} et comporte ${numberDays} jours de travail.</li>
        <li>Chaque leçon dure ${lessonDuration}h.</li></ul>`)
  );
  const teachersTbody = document.getElementById("tbody-teachers");
  while (teachersTbody.firstChild) {
    teachersTbody.removeChild(teachersTbody.firstChild);
  }
  teachers.forEach((teacher) => {
    const tr = putElementIn("tr", teachersTbody);

    const nameTd = putElementIn("td", tr);
    fillTdWithTeacherAndDisk(nameTd, teacher.name, teacher.color);

    const recDaysOffTd = putElementIn("td", tr);
    const recDaysOffSelect = putElementIn("select", recDaysOffTd);
    recDaysOffSelect.setAttribute("multiple", "true");
    recDaysOffSelect.setAttribute("size", "1");
    recDaysOffSelect.style.width = "80%";
    recDaysOffSelect.style.height = "90%";
    recDaysOffSelect.setAttribute(
      "title",
      "Maintenir la touche Ctrl pour une selection multiple."
    );
    weekDays.forEach((weekDay) => {
      const daysOffOption = putElementIn("option", recDaysOffSelect);
      daysOffOption.setAttribute("value", weekDay.index);
      daysOffOption.innerHTML = weekDay.name;
    });
    recDaysOffSelect.addEventListener("change", (event) =>
      handleRecDaysOffSelectChange(event, teacher)
    );

    const daysOffTd = putElementIn("td", tr);
    const daysOffInput = putElementIn("input", daysOffTd);
    daysOffInput.setAttribute("type", "date");
    daysOffInput.setAttribute("placeholder", "Congés");
    daysOffInput.className = "teacher-days-off";
    daysOffInput.style.width = "80%";
    flatpickr(".teacher-days-off", {
      mode: "multiple",
      dateFormat,
    });
    daysOffInput.addEventListener("change", (event) =>
      handleDaysOffInputChange(event, teacher)
    );

    const workingHoursTd = putElementIn("td", tr);
    const workingHoursMinLabel = putElementIn("label", workingHoursTd);
    workingHoursMinLabel.innerHTML = "Min: ";
    workingHoursMinLabel.style.paddingLeft = "5px";
    const workingHoursMinInput = putElementIn("input", workingHoursTd);
    workingHoursMinInput.setAttribute("type", "number");
    workingHoursMinInput.setAttribute("min", 0);
    workingHoursMinInput.style.width = "20%";
    workingHoursMinInput.setAttribute(
      "title",
      "Laisser le champ vide pour ne pas mettre de limite."
    );
    workingHoursMinInput.addEventListener("change", (event) =>
      handleWorkingHoursMinInputChange(event, teacher)
    );
    const workingHoursMaxLabel = putElementIn("label", workingHoursTd);
    workingHoursMaxLabel.innerHTML = "Max: ";
    workingHoursMaxLabel.style.paddingLeft = "10px";
    const workingHoursMaxInput = putElementIn("input", workingHoursTd);
    workingHoursMaxInput.setAttribute("type", "number");
    workingHoursMaxInput.setAttribute("min", 0);
    workingHoursMaxInput.style.width = "20%";
    workingHoursMaxInput.setAttribute(
      "title",
      "Laisser le champ vide pour ne pas mettre de limite."
    );
    workingHoursMaxInput.addEventListener("change", (event) =>
      handleWorkingHoursMaxInputChange(event, teacher)
    );

    const levelsTd = putElementIn("td", tr);
    const levelsSelect = putElementIn("select", levelsTd);
    levelsSelect.setAttribute("multiple", "true");
    levelsSelect.setAttribute("size", "1");
    levelsSelect.style.width = "80%";
    levelsSelect.style.height = "90%";
    levelsSelect.setAttribute(
      "title",
      "Maintenir la touche Ctrl pour une selection multiple."
    );
    levelNames.forEach((name) => {
      const levelOption = putElementIn("option", levelsSelect);
      levelOption.setAttribute("value", name);
      levelOption.innerHTML = name;
    });
    levelsSelect.addEventListener("change", (event) =>
      handleLevelsSelectChange(event, teacher)
    );
  });
}

function handleRecDaysOffSelectChange(event, teacher) {
  teacher.recurrentDaysOff = Array.from(event.target.selectedOptions).map(
    (option) => option.value
  );
}

function handleDaysOffInputChange(event, teacher) {
  teacher.daysOff = event.target.value.split(", ");
}

function handleWorkingHoursMinInputChange(event, teacher) {
  teacher.workingHours.min = event.target.value;
}

function handleWorkingHoursMaxInputChange(event, teacher) {
  teacher.workingHours.max = event.target.value;
}

function handleLevelsSelectChange(event, teacher) {
  teacher.preferedLevelNames = Array.from(event.target.selectedOptions).map(
    (option) => option.value
  );
}

function buildHtmlLevelsConditions(levels) {
  const levelsTbody = document.getElementById("tbody-levels");
  while (levelsTbody.firstChild) {
    levelsTbody.removeChild(levelsTbody.firstChild);
  }
  levels.forEach((level) => {
    const tr = putElementIn("tr", levelsTbody);

    const activeTd = putElementIn("td", tr);
    const activeInput = putElementIn("input", activeTd);
    activeInput.setAttribute("type", "checkbox");
    activeInput.checked = level.active;
    activeInput.addEventListener("change", (event) =>
      handleActiveChange(level, event.target.checked, levels)
    );

    const nameTd = putElementIn("td", tr);
    nameTd.innerHTML = level.name;
  });
}

function handleActiveChange(level, value, levels) {
  level.active = value;
  if (!value) {
    document.getElementById("levels-checkbox").checked = false;
  }
  if (levels.length === levels.filter((l) => l.active).length) {
    document.getElementById("levels-checkbox").checked = true;
  }
}
