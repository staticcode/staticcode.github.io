export default function (state = [], action) {
  switch (action.type) {
    case 'SELECT_PUBLIC':
      return [...state, action.teaserId];
    case 'DESELECT_PUBLIC':
      return state.filter(teaserId => teaserId !== action.teaserId);
    case 'SELECT_PUBLICS_ON_PAGE':
      return [...state, ...action.teasersId.filter(teaserId => state.indexOf(teaserId) === -1)];
    case 'DESELECT_PUBLICS_ON_PAGE':
      return state.filter(teaserId => action.teasersId.indexOf(teaserId) === -1);
    case 'DOWNLOAD_XLS':
      return [];
    default:
      return state;
  }
}
