function fillSelectOptions(selectId, optionList) {
  const select = document.getElementById(selectId);
  optionList.forEach((value) => {
    const option = putElementIn("option", select);
    option.setAttribute("value", value);
    option.innerHTML = value;
  });
}

function sizeCalendarPage(daysNumber, roomNumber) {
  changeStyle(
    "--page-width",
    `calc(300px + ${daysNumber} * ${roomNumber} * var(--table-content-td-width)`
  );
}

function styleBorderThick(filters) {
  const roomLength = filterRooms(rooms, filters).length;
  const borderThick = getStyle("--table-border-thick");
  const cellsRoomHeaders = document.querySelectorAll(
    `table.calendar thead tr:not(:first-child) th:nth-child(${roomLength}n):not(:last-child)`
  );
  const cellContentCells = document.querySelectorAll(
    `table.calendar tbody tr td:nth-child(${roomLength}n + 1):not(:last-child)`
  );
  cellsRoomHeaders.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
  cellContentCells.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
}

function styleColorCalendarCells(filters) {
  // normal cells
  const allCellsSelector = `table.calendar tbody tr td:not(:first-child):not(.booked)`;
  styleColorEvenCells(
    "--table-content-odd",
    "--table-content-even",
    allCellsSelector,
    filters
  );
  // lunch cells
  const allLunchCellsSelector = `table.calendar td.lunch:not(.booked)`;
  styleColorEvenCells(
    "--table-lunch-odd",
    "--table-lunch-even",
    allLunchCellsSelector,
    filters
  );
}

function styleColorEvenCells(
  colorOddCssVariable,
  colorEvenCssVariable,
  allCellsSelector,
  filters
) {
  colorCells(allCellsSelector, getStyle(colorOddCssVariable));
  const roomLength = filterRooms(rooms, filters).length;
  let evenCellsSelector = "";
  for (let i = 0; i < roomLength; i++) {
    const a = 2 * roomLength;
    const b = i + 2 - roomLength;
    const signB = b < 0 ? "-" : "+";
    const absB = Math.abs(b);
    evenCellsSelector += `${allCellsSelector}:nth-child(${a}n ${signB} ${absB})`;
    if (i < roomLength - 1) {
      evenCellsSelector += ", ";
    }
  }
  colorCells(evenCellsSelector, getStyle(colorEvenCssVariable));
}

function colorCells(cellsSelector, color) {
  document.querySelectorAll(cellsSelector).forEach((cell) => {
    cell.style.backgroundColor = color;
  });
}

function fillTdWithNameAndDisk(td, name, lesson, list, colorLessonBy) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = lesson[name];
  const divDisk = putElementIn("div", wrapper);
  if (colorLessonBy === name) {
    divDisk.style.backgroundColor = list.find(
      (item) => item.name === lesson[name]
    )?.color;
  }
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