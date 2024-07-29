// public
function submitForm() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const daysBetween = calculateDaysBetween(startDate, endDate);
  if (daysBetween < 0) {
    console.log(`End date must be after the start date.`);
  } else {
    console.log(`Between ${startDate} and ${endDate}.`);
    const result = generateDateArray(startDate, endDate);
    console.log(result);
  }
}

// private
function calculateDaysBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDifference = endDate - startDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference;
}

// private
function generateDateArray(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push({
      weekDay: d.getDay() === 0 ? 7 : d.getDay(),
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }
  return dateArray;
}

document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendar-body");
  const monthAndYear = document.getElementById("monthAndYear");

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

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

  generateCalendar(currentMonth, currentYear);
});
