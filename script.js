const lang = "fr";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const teachers = [];

// les quart d'heures de la journée de 8h00 à 20h00
const itemQuarterTimes = [];
for (let i = 1; i <= 48; i++) {
  itemQuarterTimes.push(new QuarterTime(i));
}

const roomNames = [
  "Room 1",
  "Room 2",
  "Room 3",
  "Room 4",
  "Room 5",
  "Room 6",
  "Room 7",
  "Room 8",
];
const rooms = roomNames.map((name) => new Room(name));

// public
function submitForm() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  const daysBetween = getDaysNumberBetween(endDate, startDate);
  if (daysBetween <= 0) {
    console.log(`End date must be after the start date.`);
  } else {
    const calendarData = getCalendarData(startDate, endDate);
    generateCalendar(calendarData);
  }
}

// private
function getCalendarData(startDate, endDate) {
  const calendarData = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    calendarData.push(
      new CalendarItem(
        new ItemDate(d.getFullYear(), d.getMonth(), d.getDate()),
        itemQuarterTimes.map((item) => new CalendarItemTimeRoom(item, rooms))
      )
    );
  }
  return calendarData;
}

// private
function generateCalendar(calendarData) {
  console.log(calendarData);
  const wrapper = document.getElementById("calendar-wrapper");
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
}

// private
// function getMonths(dateSelectionList) {
//   return dateSelectionList
//     .map((item) => ({
//       month: item.month,
//       year: item.year,
//     }))
//     .reduce(
//       (accumulator, current) => {
//         const monthYear = `${current.month}-${current.year}`;
//         if (!accumulator.seen.has(monthYear)) {
//           accumulator.seen.add(monthYear);
//           accumulator.result.push(current);
//         }
//         return accumulator;
//       },
//       { seen: new Set(), result: [] }
//     ).result;
// }

// function generateCalendar(month, year, dateSelectionList) {
//   const daysSelectionList = dateSelectionList
//     .filter((item) => item.month === month + 1 && item.year === year)
//     .map((item) => item.day);

//   const calendarBody = buildStructureAndGetTableBody(month, year);

//   const today = new Date();
//   const firstDay = new Date(year, month).getDay();
//   const daysInMonth = 32 - new Date(year, month, 32).getDate();

//   let date = 1;
//   for (let i = 0; i < 6; i++) {
//     const row = document.createElement("tr");

//     for (let j = 0; j < 7; j++) {
//       const cell = document.createElement("td");
//       if ((i === 0 && j < (firstDay + 6) % 7) || date > daysInMonth) {
//         const cellText = document.createTextNode("");
//         cell.appendChild(cellText);
//         cell.classList.add("not-selected");
//       } else {
//         if (daysSelectionList.includes(date)) {
//           const cellText = document.createTextNode(date);
//           if (
//             date === today.getDate() &&
//             year === today.getFullYear() &&
//             month === today.getMonth()
//           ) {
//             const span = document.createElement("span");
//             span.classList.add("highlight-circle");
//             span.appendChild(cellText);
//             cell.appendChild(span);
//           } else {
//             cell.appendChild(cellText);
//           }
//         } else {
//           cell.classList.add("not-selected");
//         }
//         date++;
//       }
//       row.appendChild(cell);
//     }
//     calendarBody.appendChild(row);
//   }
// }

// function buildStructureAndGetTableBody(month, year) {
//   const wrapper = document.getElementById("calendar-wrapper");
//   const calendarMonth = document.createElement("div");
//   wrapper.appendChild(calendarMonth);
//   const calendarMonthHeader = document.createElement("div");
//   calendarMonthHeader.className = "calendar-header";
//   calendarMonth.appendChild(calendarMonthHeader);
//   const monthAndYear = document.createElement("span");
//   monthAndYear.textContent = `${new Date(year, month).toLocaleString(
//     "default",
//     { month: "long" }
//   )} ${year}`;
//   calendarMonthHeader.appendChild(monthAndYear);
//   const table = document.createElement("table");
//   table.setAttribute("id", "myTable");
//   table.className = "calendar-table";
//   calendarMonth.appendChild(table);
//   const thead = document.createElement("thead");
//   table.appendChild(thead);
//   const tr = document.createElement("tr");
//   thead.appendChild(tr);
//   dayNames.forEach((item) => {
//     const th = document.createElement("th");
//     th.innerHTML = item;
//     tr.appendChild(th);
//   });
//   const calendarBody = document.createElement("tbody");
//   table.appendChild(calendarBody);

//   return calendarBody;
// }
