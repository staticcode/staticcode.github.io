export default function (state = window.filterConfig(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'CHANGE_FILTER':
      return { ...state, page: 1, ...action.payload }; // при изменении фильра всегда должна грузиться первая страница
    case 'RESET_CURRENT_FILTER':
      return { ...state, ...{ [action.payload]: window.filterConfig()[action.payload] } };
    case 'RESET_FILTER':
      return window.filterConfig();
    case 'LOAD_FILTER_TEMPLATE':
      return action.payload;
    default:
      return state;
  }
}
