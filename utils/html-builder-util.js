function buildHtmlLessonListAndCalendar(
  lessonForm,
  lessonList,
  startDate,
  endDate,
  visibility,
  colorLessonBy,
  lang,
  minTime,
  minLunchTime,
  maxLunchTime,
  filters,
  dates,
  quarterTimes,
  highlight,
  remove
) {
  buildHtmlLessonList(
    lessonForm,
    lessonList,
    startDate,
    endDate,
    lang,
    visibility,
    colorLessonBy,
    filters,
    highlight,
    remove
  );
  buildHtmlCalendar(
    lessonList,
    visibility,
    startDate,
    endDate,
    lang,
    minTime,
    minLunchTime,
    maxLunchTime,
    colorLessonBy,
    filters,
    dates,
    quarterTimes,
    highlight
  );
}

function buildHtmlLessonList(
  lessonForm,
  lessonList,
  startDate,
  endDate,
  lang,
  visibility,
  colorLessonBy,
  filters,
  highlight,
  remove
) {
  const lessonsTbody = document.getElementById("lessons");
  const trs = lessonsTbody.querySelectorAll("tr");
  for (let i = trs.length - 1; i > 0; i--) {
    lessonsTbody.removeChild(trs[i]);
  }
  lessonForm.date.setAttribute("min", startDate);
  lessonForm.date.setAttribute("max", endDate);
  filterAndSort(lessonList, visibility, startDate, endDate, filters).forEach(
    (lesson) => {
      const tr = putElementIn("tr", lessonsTbody);
      if (lesson.highlight) {
        tr.className = "highlightedRow";
      }
      tr.onclick = () => {
        highlight(lesson.date, lesson.time);
      };

      const dateTd = putElementIn("td", tr);
      dateTd.innerHTML = printDateText(lesson.localDate, lang);

      const timeFromTd = putElementIn("td", tr);
      timeFromTd.innerHTML = lesson.timeFrom;

      const timeToTd = putElementIn("td", tr);
      timeToTd.innerHTML = lesson.timeTo;

      const teacherTd = putElementIn("td", tr);
      fillTdWithNameAndDisk(
        teacherTd,
        "teacherName",
        lesson,
        teachers,
        colorLessonBy
      );

      const levelTd = putElementIn("td", tr);
      fillTdWithNameAndDisk(
        levelTd,
        "levelName",
        lesson,
        levels,
        colorLessonBy
      );

      const removeButtonTd = putElementIn("td", tr);
      removeButtonTd.setAttribute("colspan", 2);
      if (lesson.highlight) {
        const removeButton = putElementIn("div", removeButtonTd);
        removeButton.className = "button";
        removeButton.onclick = () => {
          remove(lesson.date, lesson.time);
        };
        removeButton.innerHTML = "-";
      }
    }
  );
}

function buildHtmlCalendar(
  lessonList,
  visibility,
  startDate,
  endDate,
  lang,
  minTime,
  minLunchTime,
  maxLunchTime,
  colorLessonBy,
  filters,
  dates,
  quarterTimes,
  highlight
) {
  const filteredSortedList = filterAndSort(
    lessonList,
    visibility,
    startDate,
    endDate,
    filters
  );
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
    thDay.innerHTML = printDateText(date, lang);
  });

  // Contenu du calendrier
  quarterTimes.forEach((quarterTime) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    if ([1, 3].includes(quarterTime % 4)) {
      td.innerHTML = getTimeTextFrom(quarterTime, minTime);
    }
    dates.forEach((date) => {
      const td = putElementIn("td", tr);
      if (isLunchTime(quarterTime, minTime, minLunchTime, maxLunchTime)) {
        td.className = "lunch";
      }
      const lesson = filteredSortedList.find((l) =>
        isLessonToShow(l, getDateTextFromLocalDate(date), quarterTime, minTime)
      );
      if (!!lesson) {
        td.className = "booked";
        td.innerHTML = lesson.getInnerHtml(quarterTime, minTime);
        td.style.backgroundColor = lesson.getBackgroundColor(colorLessonBy);
        if (lesson.highlight) {
          td.classList.add("highlighted-lesson");
        }
        td.setAttribute("title", lesson.title);
        td.onclick = () => {
          highlight(lesson.date, lesson.time);
        };
      }
    });
  });
  styleBorderThick();
  styleColorCalendarCells();
  sizeCalendarPage(dates.length);
}
