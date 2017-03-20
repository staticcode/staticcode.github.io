export default function (state = '', action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'INCREMENT_FAVORITES':
      return state + action.payload;
    case 'DECREMENT_FAVORITES':
      return state - action.payload;
    default :
      return state;
  }
}
