export default function (state = { count: 0, items: [] }, action) {
  switch (action.type) {
    case 'FETCH_DATA':
      return action.data
    default:
      return state;
  }
}
