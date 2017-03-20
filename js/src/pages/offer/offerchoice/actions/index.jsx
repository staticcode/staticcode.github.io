

export function changeHeadSoutceType(index) {
  return {
    type: 'CHANGE_HEAD_SOUTCE_TYPE',
    payload: index,
  };
}

export function changeFilter(data) {
  return {
    type: 'CHANGE_FILTER',
    payload: data,
  };
}

export function changeDatepicker(data) {
  return {
    type: 'CHANGE_DATEPICKER',
    payload: data,
  };
}

export function changeQuickSets(id) {
  return {
    type: 'CHANGE_QUICK_SETS',
    payload: id,
  };
}

export function toggleVisibilityFilter() {
  return {
    type: 'TOGGLE_VISIBILITY_FILTER',
  };
}

export function togglePreloader() {
  return {
    type: 'TOGGLE_PRELOADER',
  };
}

export function resetStore() {
  return {
    type: 'RESET_STORE',
  };
}

export function loadFilteredData(data) {
  return {
    type: 'LOAD_FILTERED_DATA',
    payload: data,
  };
}

export function loadSortedData(data) {
  return {
    type: 'LOAD_SORTED_DATA',
    payload: data,
  };
}

export function loadNextData(data) {
  return {
    type: 'LOAD_NEXT_DATA',
    payload: data,
  };
}
