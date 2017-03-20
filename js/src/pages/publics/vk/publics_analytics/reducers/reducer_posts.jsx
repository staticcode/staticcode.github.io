export default function (state = { totalCount: 0, items: [] }, action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'FETCH_POSTS':
      return { ...state, ...action.data };
    case 'LOAD_NEXT_PAGE':
      return { ...state, items: [...state.items, ...action.data.items] };
    default :
      return state;
  }
}
