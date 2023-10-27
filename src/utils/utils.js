export function formatDateToDDMMYYYY(inputDate) {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function parseDateFromDDMMYYYY(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}
