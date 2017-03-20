export default function (state = [], action) {
  // console.log('Action received', action);
  switch (action.type) {
    case 'SELECT_GROUP_TEASERS':
      return [...state, ...action.teasersId.filter(teaserId => state.indexOf(teaserId) === -1)];
    case 'SELECT_TEASER':
      return [...state, action.teaserId];
    case 'DESELECT_GROUP_TEASERS':
      return state.filter(teaserId => action.teasersId.indexOf(teaserId) === -1);
    case 'DESELECT_TEASER':
      return state.filter(teaserId => teaserId !== action.teaserId);
    case 'DESELECT_ALL_TEASERS':
      return [];
    default :
      return state;
  }
}
