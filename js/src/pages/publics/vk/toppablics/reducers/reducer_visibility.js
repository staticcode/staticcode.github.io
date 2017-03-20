export default function (state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, ...action.visibility };
    case 'FETCH_TABLE_DATA':
      return { ...state, loading: false };
    default:
      return state;
  }
}
