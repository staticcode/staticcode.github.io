
export default function (state = window.adsAndPostsInitialData(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'TOGGLE_ADS_PRELOADER':
      return {
        ...state,
        loading: action.payload,
      };
    case 'LOAD_ADS_DATA':
      return {
        ...state,
        // loading: false,
        ...action.payload,
      };
    default:
      return state;
  }
}
