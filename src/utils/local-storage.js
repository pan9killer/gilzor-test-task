export const getFromLocalStorage = (key) => {
  const rawData = localStorage.getItem(key);
  if (rawData) {
    return JSON.parse(rawData);
  }
  return null;
};

export const saveToLocalStorage = (key, data) => {
  const stringifiedData = JSON.stringify(data);
  localStorage.setItem(key, stringifiedData);
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const updateInLocalStorage = (key, newData) => {
  const existingData = getFromLocalStorage(key);
  if (existingData) {
    const updatedData = [...existingData, newData];
    saveToLocalStorage(key, updatedData);
  } else {
    saveToLocalStorage(key, [newData]);
  }
};
