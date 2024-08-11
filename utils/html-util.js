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

function styleBorderThick() {
  const borderThick = getStyle("--table-border-thick");
  const cellsHeaders = document.querySelectorAll(
    `table.calendar thead tr:not(:first-child) th:nth-child(n):not(:last-child)`
  );
  const cellContentCells = document.querySelectorAll(
    `table.calendar tbody tr td:nth-child(n + 1):not(:last-child)`
  );
  cellsHeaders.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
  cellContentCells.forEach((cell) => {
    cell.style.borderRight = borderThick;
  });
}

function styleColorCalendarCells() {
  // normal cells
  const allCellsSelector = `table.calendar tbody tr td:not(:first-child):not(.booked):not(.weekend)`;
  styleColorEvenCells(
    "--table-content-odd",
    "--table-content-even",
    allCellsSelector
  );
}

function styleColorEvenCells(
  colorOddCssVariable,
  colorEvenCssVariable,
  allCellsSelector
) {
  colorCells(allCellsSelector, getStyle(colorOddCssVariable));
  const evenCellsSelector = `${allCellsSelector}:nth-child(2n - 1)`;
  colorCells(evenCellsSelector, getStyle(colorEvenCssVariable));
}

function colorCells(cellsSelector, color) {
  document.querySelectorAll(cellsSelector).forEach((cell) => {
    cell.style.backgroundColor = color;
  });
}

function fillTdWithTeacherAndDisk(td, lesson, list) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = lesson.teacherName;
  const divDisk = putElementIn("div", wrapper);
  divDisk.style.backgroundColor = list.find(
    (item) => item.teacherName === lesson.teacherName
  )?.color;
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
