export const changeFilter = (filter) => ({
  type: 'CHANGE_FILTER',
  payload: filter,
});

export const toggleGeoDropdown = (filter) => ({
  type: 'TOGGLE_GEO_DROPDOWN',
  payload: filter,
});

export const resetFilter = () => ({
  type: 'RESET_FILTER',
});
