export const fetchChartData = (params, callbackAction = { type: '' }) => dispatch => {
  $.getJSON('/public/ig/default/load', { params, method: 'scheduleInfo' }, chartData => {
    dispatch({
      type: 'FETCH_CHART_DATA',
      chartData,
    });
    dispatch(callbackAction);
  });
};

export const fetchTabletData = (params, callbackAction = { type: '' }) => dispatch => {
  $.getJSON('/public/ig/default/load', { params, method: 'getDynamicAudit' }, tableData => {
    dispatch({
      type: 'FETCH_TABLE_DATA',
      tableData,
    });
  });
};

export const changeChart = (config, index) => dispatch => {
  dispatch(fetchChartData(config, {
    type: 'CHANGE_CHART',
    payload: index,
  }));
};

export const changeDateGroup = (config, group) => dispatch => {
  dispatch(fetchChartData(config, {
    type: 'CHANGE_DATE',
    payload: { group },
  }));
};

export const changeDate = (config, date) => dispatch => {
  dispatch({
    type: 'CHANGE_DATE',
    payload: date,
  });
  dispatch(fetchChartData(config));
  dispatch(fetchTabletData(config));
};

export const toggleChartSeries = series => ({
  type: 'TOGGLE_CHART_SERIES',
  payload: series,
});


