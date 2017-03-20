export const loadState = (itemName = 'state') => {
  try {
    const serializedState = localStorage.getItem(itemName);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state, itemName = 'state') => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(itemName, serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
