export const getFromStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
  return value;
};

export const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};
