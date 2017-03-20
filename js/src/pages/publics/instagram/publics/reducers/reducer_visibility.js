export default function (state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, ...action.visibility };
    case 'START_FETCHING':
      return { ...state, loading: true, applyButtonVisibility: false };
    case 'FETCH_DATA':
      return { ...state, loading: false };
    default:
      return state;
  }
}
