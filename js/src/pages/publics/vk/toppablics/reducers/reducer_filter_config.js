export default function (state = window.filterConfig(), action) {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return { ...state, page: 0, ...action.filter };
    case 'RESET_FILTER':
      return window.filterConfig();
    default:
      return state;
  }
}
