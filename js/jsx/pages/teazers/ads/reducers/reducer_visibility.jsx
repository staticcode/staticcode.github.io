export default function (state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, ...action.payload };
    case 'FETCH_TEASERS':
      return { ...state, loading: false };
    case 'SET_COUNTS':
      return { ...state, loadingCount: false };
    case 'FETCH_COUNT_ADS_FOR_FREEMIUM':
      return { ...state, freemiumCounter: true };
    default:
      return state;
  }
}
