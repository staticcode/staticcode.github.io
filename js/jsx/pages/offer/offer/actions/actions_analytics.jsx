export function resetFilters() {
  return {
    type: 'RESET_ANALYTICS_FILTER',
  };
}

export function changeFilter(data) {
  return {
    type: 'CHANGE_ANALYTICS_FILTER',
    payload: data,
  };
}

export function togglePreloader(data) {
  return {
    type: 'TOGGLE_ANALYTICS_PRELOADER',
    payload: data,
  };
}

export function toggleStatus(data) {
  return {
    type: 'TOGGLE_ANALYTICS_STATUS',
    payload: data,
  };
}

export function loadFilteredData(data) {
  return {
    type: 'LOAD_ANALYTICS_FILTERED_DATA',
    payload: data,
  };
}

export function changeQuickSets(data) {
  return {
    type: 'CHANGE_QUICKSETS',
    payload: data,
  };
}

// handleToggleChart
// changeQuickSets
