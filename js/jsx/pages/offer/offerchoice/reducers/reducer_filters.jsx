
export default function (state = window.filtersData(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'RESET_STORE':
      return window.filtersData();
    case 'TOGGLE_VISIBILITY_FILTER':
      return { ...state, visibilityFilter: !state.visibilityFilter };
    case 'CHANGE_QUICK_SETS':
      return {
        ...state,
        filter: { ...state.filter, ...{ quickSets: action.payload } },
        quickSets: state.quickSets.map(item => (
          { ...item, checked: item.id === action.payload }
        )),
      };
    case 'CHANGE_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'CHANGE_DATEPICKER':
      return { ...state, ...action.payload };
    case 'LOAD_NEXT_DATA':
      return {
        ...state,
        filter: { ...state.filter, page: state.filter.page + 1 },
      };
    case 'LOAD_FILTERED_DATA':
      return {
        ...state,
        filter: { ...state.filter, page: 1 },
      };
    case 'LOAD_SORTED_DATA':
      return {
        ...state,
        filter: {
          ...state.filter,
          column: action.payload.column,
          sort: action.payload.sort,
        },
      };
    default:
      return state;
  }
}
