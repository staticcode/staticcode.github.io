export function resetStore() {
  return {
    type: 'RESET_PP_STORE',
  };
}

export function changeFilter(data) {
  return {
    type: 'CHANGE_PP_FILTER',
    payload: data,
  };
}

export function togglePreloader(data) {
  return {
    type: 'TOGGLE_PP_PRELOADER',
    payload: data,
  };
}

export function toggleStatus(data) {
  return {
    type: 'TOGGLE_PP_STATUS',
    payload: data,
  };
}

export function loadFilteredData(data) {
  return {
    type: 'LOAD_PP_FILTERED_DATA',
    payload: data,
  };
}

export function loadNextData(data) {
  return {
    type: 'LOAD_PP_NEXT_DATA',
    payload: data,
  };
}

export function loadSortedData(data) {
  return {
    type: 'LOAD_PP_SORTED_DATA',
    payload: data,
  };
}
