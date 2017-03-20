export default function (state = window.postsFilterConfig(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'CHANGE_FILTER':
      return { ...state, page: 0, ...action.filter };
    case 'CHANGE_PAGE':
      return { ...state, page: state.page + 1 }; // при изменении фильра всегда должна грузиться нулевая страница
    case 'RESET_FILTERS':
      return window.postsFilterConfig();
    default:
      return state;
  }
}
