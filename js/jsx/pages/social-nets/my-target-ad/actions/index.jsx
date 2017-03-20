
export const fetchData = (config, dataKey, path = '/mytarget/mobile/cview') => dispatch => {
  dispatch(toggleVisibility({ loading: true }));
  $.post(path, { ...config }, data => dispatch({
    type: 'FETCH_DATA',
    page: config.params.page,
    dataKey,
    data,
  }), 'json');
};


export function toggleVisibility(visibility) {
  return {
    type: 'TOGGLE_VISIBILITY',
    payload: visibility,
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


export function toggleTeaserSelection(id, { target: { checked } }) {
  return !checked ? selectTeaser(id) : deselectTeaser(id);
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

