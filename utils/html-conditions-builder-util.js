function buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays) {
  const regularDates = selectedDates
    .filter((date) => date.type === "regular")
    .map((date) => date.date);
  const firstDate = selectedDates.map((date) => date.date)[0];
  const lastDate = regularDates[regularDates.length - 1];
  buildHtmlTeachersConditions(
    teachers,
    levelNames,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays,
    selectedDates
      .filter((date) => date.type === "holiday")
      .map((date) => date.date),
    openDays
  );
}

function buildHtmlTeachersConditions(
  teachers,
  levelNames,
  startDate,
  endDate,
  lessonDuration,
  numberDays,
  bankHolidays,
  openDays
) {
  const holidays = bankHolidays
    .map((bh) => printDateFull(bh))
    .join(", ")
    .replace(/, ([^,]*)$/, " et $1");

  Array.from(document.getElementsByClassName("period-info")).forEach(
    (dateIndication) =>
      (dateIndication.innerHTML = `
        <ul class="period">
          <li>La période va du ${startDate} au ${endDate} et comporte ${numberDays} jours de travail.</li>
          <li>${
            !holidays ? "Il n'y a pas de jours fériés." : "Jours fériés: "
          } ${!holidays ? "" : holidays + "."}</li>
          <li>Chaque leçon dure ${lessonDuration}h.</li>
        </ul>
      `)
  );
  const teachersTbody = document.getElementById("tbody-teachers");
  while (teachersTbody.firstChild) {
    teachersTbody.removeChild(teachersTbody.firstChild);
  }
  teachers.forEach((teacher) => {
    const tr = putElementIn("tr", teachersTbody);

    const nameTd = putElementIn("td", tr);
    fillTdWithTeacherAndDisk(nameTd, teacher.name, teacher.backgroundColor);

    const recDaysOffTd = putElementIn("td", tr);
    const recDaysOffSelect = putElementIn("select", recDaysOffTd);
    recDaysOffSelect.setAttribute("multiple", "true");
    recDaysOffSelect.style.width = "80%";
    recDaysOffSelect.style.height = "85%";
    recDaysOffSelect.setAttribute(
      "title",
      "Maintenir la touche Ctrl pour une selection multiple."
    );
    openDays
      .filter((d) => d.active)
      .forEach((d) => {
        const daysOffOption = putElementIn("option", recDaysOffSelect);
        daysOffOption.setAttribute("value", d.day);
        daysOffOption.innerHTML = getDayText(d.day);
        if (teacher.recurrentDaysOff.includes(d.day)) {
          daysOffOption.selected = true;
        }
      });
    recDaysOffSelect.addEventListener("change", (event) =>
      handleRecDaysOffSelectChange(event, teacher)
    );

    const daysOffTd = putElementIn("td", tr);
    const daysOffInput = putElementIn("input", daysOffTd);
    daysOffInput.setAttribute("type", "date");
    daysOffInput.setAttribute("placeholder", "Congés");
    const nameId = teacher.name.replace(/\s+/g, "");
    daysOffInput.setAttribute("id", `days-off-${nameId}`);
    daysOffInput.style.width = "80%";
    const datePicker = flatpickr(`#days-off-${nameId}`, {
      mode: "multiple",
      dateFormat,
    });
    datePicker.setDate(teacher.daysOff);
    daysOffInput.addEventListener("change", (event) =>
      handleDaysOffInputChange(event, teacher)
    );

    const workingHoursTd = putElementIn("td", tr);
    const workingHoursMinLabel = putElementIn("label", workingHoursTd);
    workingHoursMinLabel.innerHTML = "Min: ";
    workingHoursMinLabel.style.paddingLeft = "5px";
    const workingHoursMinInput = putElementIn("input", workingHoursTd);
    workingHoursMinInput.setAttribute("type", "number");
    workingHoursMinInput.setAttribute("min", lessonDuration);
    workingHoursMinInput.setAttribute("max", lessonDuration * numberDays);
    workingHoursMinInput.value = teacher.workingHours.min;
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
    workingHoursMaxInput.setAttribute("min", lessonDuration);
    workingHoursMaxInput.setAttribute("max", lessonDuration * numberDays);
    workingHoursMaxInput.value = teacher.workingHours.max;
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
    levelsSelect.style.width = "80%";
    levelsSelect.style.height = "85%";
    levelsSelect.setAttribute(
      "title",
      "Maintenir la touche Ctrl pour une selection multiple."
    );
    levelNames.forEach((name) => {
      const levelOption = putElementIn("option", levelsSelect);
      levelOption.setAttribute("value", name);
      levelOption.innerHTML = name;
      if (teacher.preferedLevelNames.includes(name)) {
        levelOption.selected = true;
      }
    });

    levelsSelect.addEventListener("change", (event) =>
      handleLevelsSelectChange(event, teacher)
    );
  });
}

function handleRecDaysOffSelectChange(event, teacher) {
  teacher.recurrentDaysOff = Array.from(event.target.selectedOptions).map(
    (option) => +option.value
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
  document.getElementById("levels-checkbox").checked = levels.every(
    (l) => l.active
  );
  const levelsTbody = document.getElementById("tbody-levels");
  while (levelsTbody.firstChild) {
    levelsTbody.removeChild(levelsTbody.firstChild);
  }
  levels.forEach((level) => {
    const tr = putElementIn("tr", levelsTbody);
    const nameTd = putElementIn("td", tr);
    nameTd.innerHTML = level.name;
    const activeTd = putElementIn("td", tr);
    const activeInput = putElementIn("input", activeTd);
    activeInput.setAttribute("type", "checkbox");
    activeInput.checked = level.active;
    activeInput.addEventListener("change", (event) =>
      handleActiveChange(level, event.target.checked, levels)
    );
  });
}

function handleActiveChange(level, value, levels) {
  level.active = value;
  const checkbox = document.getElementById("levels-checkbox");
  checkbox.checked = levels.length === levels.filter((l) => l.active).length;
}

function buildHtmlOpenDays(openDays) {
  document.getElementById("open-days-checkbox").checked = openDays.every(
    (d) => d.active
  );
  const openDaysTbody = document.getElementById("tbody-open-days");
  while (openDaysTbody.firstChild) {
    openDaysTbody.removeChild(openDaysTbody.firstChild);
  }
  openDays.forEach((openDay) => {
    const tr = putElementIn("tr", openDaysTbody);
    const nameTd = putElementIn("td", tr);
    nameTd.innerHTML = getDayText(openDay.day);
    const activeTd = putElementIn("td", tr);
    const activeInput = putElementIn("input", activeTd);
    activeInput.setAttribute("type", "checkbox");
    activeInput.checked = openDay.active;
    activeInput.addEventListener("change", (event) =>
      handleActiveOpenDayChange(openDay, event.target.checked, openDays)
    );
  });
}

function handleActiveOpenDayChange(openDay, value, openDays) {
  openDay.active = value;
  const checkbox = document.getElementById("open-days-checkbox");
  checkbox.checked = openDays.length === openDays.filter((l) => l.active).length;
}

function doDownloadConditions(openDays) {
  const headers = constraintsHeaders.join(";") + "\n";
  const teacherMapped = teachers.map((t) => ({
    name: t.name,
    recurrentDaysOff: t.recurrentDaysOff
      .filter((day) =>
        openDays
          .filter((d) => d.active)
          .map((d) => d.day)
          .includes(day)
      )
      .map((d) => getDayText(+d).toLocaleLowerCase())
      .join(","),
    daysOff: t.daysOff
      .map((d) => getLessonDate(d))
      .filter((d) => !d.includes("undefined"))
      .join(","),
    workingHourMin: t.workingHours.min,
    workingHourMax: t.workingHours.max,
    preferedLevelNames: t.preferedLevelNames.join(","),
  }));
  let csvContent = headers;
  teacherMapped.forEach((t) => {
    csvContent += Object.values(t).join(";") + "\n";
  });
  const utf8BOM = "\ufeff";
  const blob = new Blob([`${utf8BOM}${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  const today = new Date();
  link.setAttribute(
    "download",
    `contraintes_${formatNumberToText(today.getDate())}-${formatNumberToText(
      today.getMonth() + 1
    )}-${formatNumberToText(today.getFullYear())}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
