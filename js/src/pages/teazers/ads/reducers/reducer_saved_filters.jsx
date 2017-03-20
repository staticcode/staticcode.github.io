export default function (state = { filters: window.userFilter(), newFilterTitle: '' }, action) {
  switch (action.type) {
    case 'WRITE_FILTER_TITLE':
      return { ...state, ...{ newFilterTitle: action.payload } };
    case 'DELETE_FILTER':
      return {
        ...state,
        filters: state.filters.filter(item => item.id !== action.payload),
      };
    case 'ADD_FILTER':
      return {
        ...state,
        ...{
          filters: state.filters.filter(item => item.title !== action.payload.title).concat(action.payload),
        },
      };
    case 'SELECT_FILTER':
      return {
        ...state,
        filters: state.filters.map(item => ({ ...item, selected: item.id === action.payload })),
      };
    case 'RESET_FILTER':
      return {
        ...state,
        filters: state.filters.map(item => ({ ...item, selected: false })),
      };

    case 'TOGGLE_ACTIVE_FILTER':
      return state;
    default:
      return state;
  }
}
