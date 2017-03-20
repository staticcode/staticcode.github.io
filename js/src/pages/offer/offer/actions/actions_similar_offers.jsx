
export function togglePreloader(data) {
  return {
    type: 'TOGGLE_SO_PRELOADER',
    payload: data,
  };
}

export function loadNextData(data) {
  return {
    type: 'LOAD_SO_NEXT_DATA',
    payload: data,
  };
}

export function loadSortedData(data) {
  return {
    type: 'LOAD_SO_SORTED_DATA',
    payload: data,
  };
}
