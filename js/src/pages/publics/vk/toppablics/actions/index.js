
export const changeDownloadConfig = config => ({
  type: 'CHANGE_DOWNLOAD_CONFIG',
  payload: config,
});

export const changeFilter = filter => ({
  type: 'CHANGE_FILTER',
  filter,
});

export const toggleVisibility = visibility => ({
  type: 'TOGGLE_VISIBILITY',
  visibility,
});


export const fetchTableData = (filterConfig = {}, page = 0) => dispatch => {
  dispatch(toggleVisibility({ loading: true }));

  $.post('/public/vk/default/filter', { ...filterConfig, page }, data => {
    dispatch({
      type: 'FETCH_TABLE_DATA',
      data,
    });
  }, 'json');
};

export const resetFilter = () => dispatch => {
  dispatch({ type: 'RESET_FILTER' });
  dispatch(fetchTableData(window.filterConfig()));
};

export const downloadedXLS = () => dispatch => {
  dispatch({ type: 'DOWNLOAD_XLS' });
};

export const deselectPublic = (teaserId) => ({
  type: 'DESELECT_PUBLIC',
  teaserId,
});


export const selectPublic = (teaserId) => ({
  type: 'SELECT_PUBLIC',
  teaserId,
});


export function selectPublicsOnPage(teasersId) {
  return {
    type: 'SELECT_PUBLICS_ON_PAGE',
    teasersId,
  };
}

export function deselectPublicsOnPage(teasersId) {
  return {
    type: 'DESELECT_PUBLICS_ON_PAGE',
    teasersId,
  };
}
