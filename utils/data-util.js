async function loadData(name) {
  try {
    const response = await fetch(`data/${name}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
