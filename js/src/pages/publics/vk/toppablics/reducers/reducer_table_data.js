export default function (state = window.stateToppablics(), action) {
  switch (action.type) {
    case 'FETCH_TABLE_DATA':
      return action.data;
    default:
      return state;
  }
}
