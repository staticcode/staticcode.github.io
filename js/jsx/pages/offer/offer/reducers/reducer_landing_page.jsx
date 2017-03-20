
export default function (state = window.landingPageInitialData(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'TOGGLE_LP_TABLE':
      return {
        ...state,
        tblToggle: action.payload,
      };
    case 'TOGGLE_LP_PRELOADER':
      return {
        ...state,
        loading: action.payload,
      };
    case 'LOAD_LP_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
