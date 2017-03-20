export default function (state = window.chartData(), action) {
  switch (action.type) {
    case 'CHANGE_CHART':
      return { ...state, info_by: action.payload };
    case 'CHANGE_DATE':
      return { ...state, date: { ...state.date, ...action.payload } };
    case 'FETCH_CHART_DATA':
      return { ...state, chartData: action.chartData };
    case 'TOGGLE_CHART_SERIES':
      return {
        ...state,
        chartData: state.chartData.map((c, i) => (
          i === action.payload
          ? { ...c, visible: !c.visible }
          : c
        ))};
    case 'FETCH_TABLE_DATA':
      return { ...state, tableData: action.tableData };
    default:
      return state;
  }
}
