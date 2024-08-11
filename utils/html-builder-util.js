function buildHtmlLessonListAndCalendar(
  lessonList,
  dates,
  levels,
  highlight,
  remove
) {
  buildHtmlLessonList(lessonList, highlight, remove);
  buildHtmlCalendar(lessonList, dates, levels, highlight);
}

function buildHtmlLessonList(lessonList, highlight, remove) {
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
      highlight(lesson.date, lesson.level);
    };

    const dateTd = putElementIn("td", tr);
    dateTd.innerHTML = printDateText(lesson.localDate);

    const teacherTd = putElementIn("td", tr);
    fillTdWithTeacherAndDisk(teacherTd, lesson, teachers);

    const levelTd = putElementIn("td", tr);
    levelTd.innerHTML = lesson.level;

    const removeButtonTd = putElementIn("td", tr);
    if (lesson.highlight) {
      const removeButton = putElementIn("div", removeButtonTd);
      removeButton.className = "button";
      removeButton.onclick = () => {
        remove(lesson.date, lesson.level);
      };
      removeButton.innerHTML = "-";
    }
  });
}

function buildHtmlCalendar(lessonList, dates, levels, highlight) {
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
  const tr = putElementIn("tr", thead);
  putElementIn("th", tr);

  // Headers jours
  dates.forEach((date) => {
    const thDay = putElementIn("th", tr);
    thDay.innerHTML = printDateText(date);
    if(thDay.innerHTML === "") {
      thDay.className = "weekend";
    }
  });

  // Contenu du calendrier
  levels.forEach((level) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    td.innerHTML = level;
    
    dates.forEach((date) => {
      const td = putElementIn("td", tr);
      if (date !== "") {
        const lesson = sort(lessonList).find((l) =>
          isLesson(l, getDateTextFromLocalDate(date), level)
        );
        if (!!lesson) {
          td.className = "booked";
          td.innerHTML = lesson.teacherName;
          td.style.backgroundColor = lesson.backgroundColor;
          if (lesson.highlight) {
            td.classList.add("highlighted-lesson");
          }
          td.setAttribute("title", lesson.title);
          td.onclick = () => {
            highlight(lesson.date, lesson.level);
          };
        }
      } else {
        td.className = "weekend";
      }
    });
  });
  styleBorderThick();
  styleColorCalendarCells();
  sizeCalendarPage(dates.length);
}
