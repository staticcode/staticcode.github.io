export default function (state = { similarImg: {}, similarLink: {}, countView: [] }, action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'FETCH_DATA':
      if (Array.isArray(action.data)) {
        return { ...state, [action.dataKey]: action.data };
      }
      return { ...state, [action.dataKey]: { ...action.data, page: action.page } };
    default :
      return state;
  }
}
