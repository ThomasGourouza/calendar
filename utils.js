function getDaysNumberBetween(endDate, startDate) {
  return (endDate - startDate) / (1000 * 3600 * 24) + 1;
}
