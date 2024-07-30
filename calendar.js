// public
function submitForm() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  const daysBetween = calculateDaysBetween(startDate, endDate);
  if (daysBetween < 0) {
    console.log(`End date must be after the start date.`);
  } else {
    console.log(`Between ${startDate} and ${endDate}.`);
    const dateList = generateDateList(startDate, endDate);
    console.log(dateList);

    const monthsList = getMonths(dateList);
    console.log(monthsList);

    // const startMonth = startDate.getMonth();
    // const startYear = startDate.getFullYear();
    // const endMonth = endDate.getMonth();
    // const endYear = endDate.getFullYear();

    generateCalendar(6, 2023);
    // generateCalendar(7, 2023);
    // generateCalendar(8, 2023);
  }
}

// private
function calculateDaysBetween(startDate, endDate) {
  const timeDifference = endDate - startDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference;
}

// private
function generateDateList(startDate, endDate) {
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
function getMonths(dateList) {
  return dateList
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

const today = new Date();
const calendarBody = document.getElementById("calendar-body");
const monthAndYear = document.getElementById("monthAndYear");

function generateCalendar(month, year) {
  const firstDay = new Date(year, month).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  monthAndYear.textContent = `${today.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  calendarBody.innerHTML = "";

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < (firstDay + 6) % 7) {
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
      } else if (date > daysInMonth) {
        break;
      } else {
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
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}
