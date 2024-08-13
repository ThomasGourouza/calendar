function buildHtmlLessonListAndCalendar(
  lessonList,
  dates,
  teachers,
  highlight,
  remove
) {
  buildHtmlLessonList(lessonList, teachers, highlight, remove);
  buildHtmlCalendar(lessonList, dates, highlight);
}

function buildHtmlLessonList(lessonList, teachers, highlight, remove) {
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");
  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }
  sort(lessonList).forEach((lesson) => {
    const tr = putElementIn("tr", lessonsTbody);
    if (lesson.highlight) {
      tr.className = "highlightedRow";
    }
    tr.onclick = () => {
      highlight(lesson.date, lesson.levelName);
    };

    const dateTd = putElementIn("td", tr);
    dateTd.innerHTML = printDateFull(lesson.localDate);

    const teacherTd = putElementIn("td", tr);
    fillTdWithTeacherAndDisk(
      teacherTd,
      lesson.teacherName,
      teachers.find((teacher) => teacher.name === lesson.teacherName)?.color
    );

    const levelTd = putElementIn("td", tr);
    levelTd.innerHTML = lesson.levelName;

    const removeButtonTd = putElementIn("td", tr);
    if (lesson.highlight) {
      const removeButton = putElementIn("div", removeButtonTd);
      removeButton.className = "button";
      removeButton.onclick = () => {
        remove(lesson.date, lesson.levelName);
      };
      removeButton.innerHTML = "-";
    }
  });
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
  const table = putElementIn("table", wrapper);
  table.className = "calendar";
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);
  const th1 = putElementIn("th", tr1);
  const th2 = putElementIn("th", tr2);

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
      case "holiday": {
        thDay1.innerHTML = printWeekDay(date.date);
        thDay1.className = "holiday";
        thDay2.innerHTML = printDate(date.date);
        thDay2.className = "holiday";
        break;
      }
      case "weekend": {
        thDay1.className = "weekend";
        thDay2.className = "weekend";
        break;
      }
      default:
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
      switch (date.type) {
        case "regular": {
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
          }
          break;
        }
        case "holiday": {
          td.className = "holiday";
          break;
        }
        case "weekend": {
          td.className = "weekend";
          break;
        }
        default:
          break;
      }
    });
  });
  sizeCalendarPage(dates.length);
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
  divName.innerHTML = teacherName;
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
