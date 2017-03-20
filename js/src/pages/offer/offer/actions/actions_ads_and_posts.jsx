
export function togglePreloader(data) {
  return {
    type: 'TOGGLE_ADS_PRELOADER',
    payload: data,
  };
}

export function loadData(data) {
  return {
    type: 'LOAD_ADS_DATA',
    payload: data,
  };
}
