
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


export const fetchData = (filterConfig = {}, page = 1) => dispatch => {
  // dispatch(toggleVisibility({ loading: true }));
  dispatch({ type: 'START_FETCHING' });

  $.getJSON('/public/ig/default/filter', { ...filterConfig, page }, data => {
    dispatch({
      type: 'FETCH_DATA',
      data,
    });
  });
};

export const resetFilter = () => dispatch => {
  dispatch({ type: 'RESET_FILTER' });
  dispatch(fetchData(window.filterConfig()));
};

export const downloadedXLS = () => dispatch => {
  dispatch({ type: 'DOWNLOAD_XLS' });
};

export const deselectPublic = (publicId) => ({
  type: 'DESELECT_PUBLIC',
  publicId,
});


export const selectPublic = (publicId) => ({
  type: 'SELECT_PUBLIC',
  publicId,
});


export function selectPublicsOnPage(publicsId) {
  return {
    type: 'SELECT_PUBLICS_ON_PAGE',
    publicsId,
  };
}

export function deselectPublicsOnPage(publicsId) {
  return {
    type: 'DESELECT_PUBLICS_ON_PAGE',
    publicsId,
  };
}
