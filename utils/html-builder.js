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
        highlight(lesson.date, lesson.time, lesson.roomName);
      };

      const dateTd = putElementIn("td", tr);
      dateTd.innerHTML = lesson.printDate();

      const timeFromTd = putElementIn("td", tr);
      timeFromTd.innerHTML = lesson.printTimeFrom();

      const timeToTd = putElementIn("td", tr);
      timeToTd.innerHTML = lesson.printTimeTo();

      const roomTd = putElementIn("td", tr);
      roomTd.innerHTML = lesson.roomName;

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
          remove(lesson.date, lesson.time, lesson.roomName);
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
  const h2 = putElementIn("h2", wrapper);
  h2.innerHTML = "Calendrier";
  const table = putElementIn("table", wrapper);
  table.className = "calendar";
  const thead = putElementIn("thead", table);
  const tbody = putElementIn("tbody", table);
  const tr1 = putElementIn("tr", thead);
  const tr2 = putElementIn("tr", thead);

  const thTitle = putElementIn("th", tr1);
  thTitle.setAttribute("rowspan", 2);

  // Headers jours et salles
  dates.forEach((date) => {
    const thDay = putElementIn("th", tr1);
    thDay.setAttribute("colspan", filterRooms(rooms, filters).length);
    thDay.innerHTML = printDateText(date, lang);

    filterRooms(rooms, filters).forEach((room) => {
      const thRoom = putElementIn("th", tr2);
      thRoom.innerHTML = room.name;
      thRoom.style.backgroundColor = room.color;
    });
  });

  // Contenu du calendrier
  quarterTimes.forEach((quarterTime) => {
    const tr = putElementIn("tr", tbody);
    const td = putElementIn("td", tr);
    if ([1, 3].includes(quarterTime % 4)) {
      td.innerHTML = getTimeTextFrom(quarterTime, minTime);
    }
    dates.forEach((date) => {
      filterRooms(rooms, filters).forEach((room) => {
        const td = putElementIn("td", tr);
        if (isLunchTime(quarterTime, minTime, minLunchTime, maxLunchTime)) {
          td.className = "lunch";
        }
        const lesson = existingLesson(
          filteredSortedList,
          getDateFromLocalDate(date),
          quarterTime,
          room.name,
          minTime
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
            highlight(lesson.date, lesson.time, lesson.roomName);
          };
        }
      });
    });
  });
  styleBorderThick(filters);
  styleColorCalendarCells(filters);
}
