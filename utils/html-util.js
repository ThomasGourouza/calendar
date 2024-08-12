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

function fillTdWithTeacherAndDisk(td, lesson, list) {
  const wrapper = putElementIn("div", td);
  wrapper.className = "two-col-td";
  const divName = putElementIn("div", wrapper);
  divName.innerHTML = lesson.teacherName;
  const divDisk = putElementIn("div", wrapper);
  divDisk.style.backgroundColor = list.find(
    (item) => item.name === lesson.teacherName
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
