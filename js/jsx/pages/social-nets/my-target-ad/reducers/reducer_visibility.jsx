export default function (state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, ...action.payload };
    case 'FETCH_DATA':
      return { ...state, loading: false };
    default:
      return state;
  }
}
