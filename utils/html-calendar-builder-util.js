function buildHtmlLessonListAndCalendar(
  lessonList,
  dates,
  teachers,
  highlight,
  remove
) {
  buildHtmlCalendar(lessonList, dates, highlight);
  buildHtmlLessonList(lessonList, teachers, remove);
}

function buildHtmlLessonList(lessonList, teachers, remove) {
  document.getElementById("date").value = "";
  document.getElementById("levels").value = "";
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");
  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }
  const lesson = lessonList.find((l) => l.highlight);
  if (!!lesson) {
    const tr = putElementIn("tr", lessonsTbody);
    const dateTd = putElementIn("td", tr);
    dateTd.innerHTML = printDateFull(lesson.localDate);
    const teacherTd = putElementIn("td", tr);
    fillTdWithTeacherAndDisk(
      teacherTd,
      lesson.teacherName,
      teachers.find((teacher) => teacher.name === lesson.teacherName)?.backgroundColor
    );
    const levelTd = putElementIn("td", tr);
    levelTd.innerHTML = lesson.levelName;
    const removeButtonTd = putElementIn("td", tr);
    const removeButton = putElementIn("div", removeButtonTd);
    removeButton.className = "button";
    removeButton.onclick = () => {
      remove(lesson.date, lesson.levelName);
    };
    removeButton.innerHTML = "&nbsp;-&nbsp;";
    removeButton.setAttribute("title", "Supprimer");
  }
}

function buildHtmlCalendar(lessonList, dates, highlight) {
  if (dates.length === 0) {
    return;
  }
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  const h1 = putElementIn("h1", wrapper);
  h1.innerHTML = "Calendrier";
  const divForDownloadButton = putElementIn("div", wrapper);
  const table = putElementIn("table", wrapper);
  table.className = "calendar";
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);
  putElementIn("th", tr1);
  putElementIn("th", tr2);

  // Headers jours
  dates.forEach((date) => {
    const thDay1 = putElementIn("th", tr1);
    const thDay2 = putElementIn("th", tr2);
    switch (date.type) {
      case "regular": {
        thDay1.innerHTML = printWeekDay(date.date);
        thDay2.innerHTML = printDate(date.date);
        break;
      }
      case "weekend": {
        thDay1.className = "weekend";
        thDay2.className = "weekend";
        break;
      }
      default:
        thDay1.innerHTML = printWeekDay(date.date);
        thDay1.className = date.type;
        thDay2.innerHTML = printDate(date.date);
        thDay2.className = date.type;
        if (date.type === "holiday") {
          thDay1.setAttribute("title", "Jour férié");
          thDay2.setAttribute("title", "Jour férié");
        }
        break;
    }
  });
  // Contenu du calendrier
  [...new Set(lessonList.map((l) => l.levelName))].sort().forEach((level) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    td.innerHTML = level;
    dates.forEach((date) => {
      const td = putElementIn("td", tr);
      if (date.type === "regular") {
        const lesson = sort(lessonList).find((l) =>
          isLesson(l, getDateTextFromLocalDate(date.date), level)
        );
        if (!!lesson) {
          td.className = "booked";
          td.innerHTML = lesson.teacherName;
          td.style.backgroundColor = lesson.backgroundColor;
          td.style.color = lesson.textColor;
          if (lesson.highlight) {
            td.classList.add("highlighted-lesson");
          }
          td.setAttribute("title", lesson.title);
          td.onclick = () => {
            highlight(lesson.date, lesson.levelName);
          };
        } else {
          td.className = "free";
          td.onclick = () => {
            fillAddForm(date.date, level, td);
          };
        }
      } else {
        td.className = date.type;
        if (date.type === "holiday") {
          td.setAttribute("title", "Jour férié");
        }
      }
    });
  });
  sizeCalendarPage(dates.length);
  createDownloadButton(divForDownloadButton, table);
}

// selectionner un créneau
function fillAddForm(date, level, td) {
  const secondClick =
    td.style.backgroundColor === getStyle("--table-content-calendar-highlighted");
  Array.from(document.getElementsByClassName("free")).forEach(
    (e) => (e.style.backgroundColor = getStyle("--table-content-calendar"))
  );
  if (secondClick) {
    document.getElementById("date").value = "";
    document.getElementById("levels").value = "";
  } else {
    td.style.backgroundColor = getStyle("--table-content-calendar-highlighted");
    document.getElementById("date").value = textDateToInput(date);
    document.getElementById("levels").value = level;
  }
}

function createDownloadButton(wrapper, table) {
  const downloadButton = putElementIn("button", wrapper);
  downloadButton.setAttribute("id", "download-button");
  downloadButton.innerHTML = "Exporter csv";
  downloadButton.className = "csv";
  downloadButton.addEventListener("click", () => downloadCalendar(table));
}

function downloadCalendar(table) {
  const rows = table.querySelectorAll("tr");
  let csvContent = "";
  rows.forEach((row) => {
    const rowContent = Array.from(row.querySelectorAll("th, td")).map(
      (r) => r.textContent
    );
    csvContent += rowContent.join(";") + "\n";
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
    `calendrier_${formatNumberToText(today.getDate())}-${formatNumberToText(
      today.getMonth() + 1
    )}-${formatNumberToText(today.getFullYear())}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function fillSelectOptions(selectId, optionList) {
  const select = document.getElementById(selectId);
  optionList.forEach((value) => {
    const option = putElementIn("option", select);
    option.setAttribute("value", value);
    option.innerHTML = value;
  });
}

function sizeCalendarPage(daysNumber) {
  changeStyle(
    "--page-width",
    `calc(300px + ${daysNumber} * var(--table-content-td-width)`
  );
}

function fillTdWithTeacherAndDisk(td, teacherName, teacherColor) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = `${teacherName}&nbsp;&nbsp;`;
  const divDisk = putElementIn("div", wrapper);
  divDisk.style.backgroundColor = teacherColor;
  divDisk.style.border = getStyle("--table-border");
}

function getStyle(cssVariable) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    cssVariable
  );
}

function changeStyle(cssVariable, value) {
  document.documentElement.style.setProperty(cssVariable, value);
}

function putElementIn(element, node) {
  const elmt = document.createElement(element);
  node.appendChild(elmt);
  return elmt;
}
