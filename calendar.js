const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// public
function submitForm() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  const daysBetween = (endDate - startDate) / (1000 * 3600 * 24) + 1;
  if (daysBetween <= 0) {
    console.log(`End date must be after the start date.`);
  } else {
    const dateSelectionList = generatedateSelectionList(startDate, endDate);

    const monthsList = getMonths(dateSelectionList);
    console.log(monthsList);

    generateNewCalendar(monthsList, dateSelectionList);
  }
}

// private
function generatedateSelectionList(startDate, endDate) {
  const dateArray = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    dateArray.push({
      weekDay: d.getDay() === 0 ? 7 : d.getDay(),
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }
  return dateArray;
}

// private
function getMonths(dateSelectionList) {
  return dateSelectionList
    .map((item) => ({
      month: item.month,
      year: item.year,
    }))
    .reduce(
      (accumulator, current) => {
        const monthYear = `${current.month}-${current.year}`;
        if (!accumulator.seen.has(monthYear)) {
          accumulator.seen.add(monthYear);
          accumulator.result.push(current);
        }
        return accumulator;
      },
      { seen: new Set(), result: [] }
    ).result;
}

function generateNewCalendar(monthsList, dateSelectionList) {
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  monthsList.forEach((month) =>
    generateCalendar(month.month - 1, month.year, dateSelectionList)
  );
}

function generateCalendar(month, year, dateSelectionList) {
  const daysSelectionList = dateSelectionList
    .filter((item) => item.month === month + 1 && item.year === year)
    .map((item) => item.day);

  const calendarBody = buildStructureAndGetTableBody(month, year);

  const today = new Date();
  const firstDay = new Date(year, month).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if ((i === 0 && j < (firstDay + 6) % 7) || date > daysInMonth) {
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
        cell.classList.add("not-selected");
      } else {
        if (daysSelectionList.includes(date)) {
          const cellText = document.createTextNode(date);
          if (
            date === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          ) {
            const span = document.createElement("span");
            span.classList.add("highlight-circle");
            span.appendChild(cellText);
            cell.appendChild(span);
          } else {
            cell.appendChild(cellText);
          }
        } else {
          cell.classList.add("not-selected");
        }
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

function buildStructureAndGetTableBody(month, year) {
  const wrapper = document.getElementById("calendar-wrapper");
  const calendarMonth = document.createElement("div");
  wrapper.appendChild(calendarMonth);
  const calendarMonthHeader = document.createElement("div");
  calendarMonthHeader.className = "calendar-header";
  calendarMonth.appendChild(calendarMonthHeader);
  const monthAndYear = document.createElement("span");
  monthAndYear.textContent = `${new Date(year, month).toLocaleString(
    "default",
    { month: "long" }
  )} ${year}`;
  calendarMonthHeader.appendChild(monthAndYear);
  const table = document.createElement("table");
  table.className = "calendar-table";
  calendarMonth.appendChild(table);
  const thead = document.createElement("thead");
  table.appendChild(thead);
  const tr = document.createElement("tr");
  thead.appendChild(tr);
  days.forEach((item) => {
    const th = document.createElement("th");
    th.innerHTML = item;
    tr.appendChild(th);
  });
  const calendarBody = document.createElement("tbody");
  table.appendChild(calendarBody);

  return calendarBody;
}
