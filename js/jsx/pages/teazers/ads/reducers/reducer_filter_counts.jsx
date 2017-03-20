export default function (state = {}, action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'SET_COUNTS':
      return { ...state, ...action.payload.items };
    // case 'RESET_CURRENT_FILTER':
    //   return { ...state, ...{ [action.payload]: filterView()[action.payload] } };
    // case 'RESET_FILTER':
    //   return filterView();
    default:
      return state;
  }
}
