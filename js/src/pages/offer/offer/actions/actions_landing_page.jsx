
export function toggleTable(data) {
  return {
    type: 'TOGGLE_LP_TABLE',
    payload: data,
  };
}

export function togglePreloader(data) {
  return {
    type: 'TOGGLE_LP_PRELOADER',
    payload: data,
  };
}

export function loadData(data) {
  return {
    type: 'LOAD_LP_DATA',
    payload: data,
  };
}
