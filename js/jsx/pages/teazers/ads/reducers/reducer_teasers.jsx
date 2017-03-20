export default function (state = { count: 0, items: [] }, action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'FETCH_TEASERS':
      return { ...state, ...action.payload };
    case 'FETCH_COUNT_ADS_FOR_FREEMIUM':
      return { ...state, freemiumCount: action.payload.count };
    default :
      return state;
  }
}
