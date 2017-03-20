export default function (state = filterView(), action) {
  // console.log('Action received', action);
  switch (action.type) {
    // case 'CHANGE_FILTER':
    //   return { ...state, ...action.payload };
    // case 'RESET_CURRENT_FILTER':
    //   return { ...state, ...{ [action.payload]: filterView()[action.payload] } };
    // case 'RESET_FILTER':
    //   return filterView();
    default:
      return state;
  }
}
