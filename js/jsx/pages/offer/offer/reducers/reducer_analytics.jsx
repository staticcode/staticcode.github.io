
export default function (state = window.analyticsInitialData(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'RESET_ANALYTICS_FILTER':
      return {
        ...state,
        filter: window.analyticsInitialData().filter,
        dropdowns: window.analyticsInitialData().dropdowns,
      };
    case 'TOGGLE_ANALYTICS_PRELOADER':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CHANGE_ANALYTICS_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'LOAD_ANALYTICS_FILTERED_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'CHANGE_QUICKSETS':
      return {
        ...state,
        quickSets: state.quickSets.map(item => ({ ...item, checked: item.id === action.payload })),
      };
    default:
      return state;
  }
}
