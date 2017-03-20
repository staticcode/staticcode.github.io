export default function (state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, ...action.visibility };
    case 'FETCH_POSTS':
      return { ...state, preloader: false };
    case 'LOAD_NEXT_PAGE':
      return { ...state, preloader: false };
    default:
      return state;
  }
}
