

export function changeFilter(filter) {
  return {
    type: 'CHANGE_FILTER',
    payload: filter,
  };
}

export function setCounts(counts) {
  return {
    type: 'SET_COUNTS',
    payload: counts,
  };
}

export function resetFilter() {
  return dispatch => {
    dispatch({ type: 'RESET_FILTER' });
    dispatch(fetchData(window.filterConfig()));
  };

}

export function resetCurrentFilter(currentFilterName) {
  return {
    type: 'RESET_CURRENT_FILTER',
    payload: currentFilterName,
  };
}

export function toggleVisibility(visibility) {
  return {
    type: 'TOGGLE_VISIBILITY',
    payload: visibility,
  };
}

export function writeFilterTitle(visibility) {
  return {
    type: 'WRITE_FILTER_TITLE',
    payload: visibility,
  };
}

export function addFilter(filter) {
  return {
    type: 'ADD_FILTER',
    payload: filter,
  };
}

export function deleteFilter(id) {
  $.post('/mytarget/mobile/fsdelete', { id }, 'json');
  return {
    type: 'DELETE_FILTER',
    payload: id,
  };
}

export function loadFilterTemplate(id) {
  return dispatch => {
    dispatch({
      type: 'SELECT_FILTER',
      payload: id,
    });
    $.post('/mytarget/mobile/loadfilter', { id }, data => {
      const config = { ...window.filterConfig(), ...data.filter };
      dispatch({
        type: 'LOAD_FILTER_TEMPLATE',
        payload: config,
      });
      dispatch(fetchData(config));
    }, 'json');
  };
}

export const fetchTeasers = config =>  dispatch => {
  dispatch(toggleVisibility({
    loading: true,
    applyButtonVisibility: false,
    freemiumCounter: false,
  }));

  $.post('/mytarget/mobile/filter', { page: 1, ...config }, data => dispatch({
    type: 'FETCH_TEASERS',
    payload: data,
  }), 'json');
};


export const fetchCountAdsForFreemium = config => dispatch => {
  $.post('/mytarget/mobile/loadcnt', { page: 1, ...config }, data => dispatch({
    type: 'FETCH_COUNT_ADS_FOR_FREEMIUM',
    payload: data,
  }), 'json');
};


export const fetchCounts = config => dispatch => {
  dispatch(toggleVisibility({
    loadingCount: true,
  }));
  $.post('/mytarget/mobile/adscnt', { page: 1, ...config }, data => {
    if (data.status === 'then') {
      setTimeout(() => dispatch(fetchCounts(config)), 2000);
    } else if (data.status === 'success') {
      return dispatch({
        type: 'SET_COUNTS',
        payload: data,
      });
    }
  }, 'json').fail(() => setTimeout(() => dispatch(fetchCounts(config)), 2000));
};


export function fetchData(config) {
  return dispatch => {
    dispatch(fetchTeasers(config));
    // dispatch(fetchCounts(config)); // получение количества объявлений по каждому пункту фильтра
    if (!window.access) {
      dispatch(fetchCountAdsForFreemium(config));
    }
  };
}


export function deselectTeaser(teaserId) {
  return {
    type: 'SELECT_TEASER',
    teaserId,
  };
}

export function selectTeaser(teaserId) {
  return {
    type: 'DESELECT_TEASER',
    teaserId,
  };
}

export function selectGroupTeasers(teasersId) {
  return {
    type: 'SELECT_GROUP_TEASERS',
    teasersId,
  };
}

export function deselectGroupTeasers(teasersId) {
  return {
    type: 'DESELECT_GROUP_TEASERS',
    teasersId,
  };
}

export function deselectAllTeasers() {
  return {
    type: 'DESELECT_ALL_TEASERS',
  };
}




