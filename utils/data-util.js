async function loadData(name, folder = "data") {
  try {
    const response = await fetch(`${folder}/${name}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
