export default function (state = [], action) {
  switch (action.type) {
    case 'SELECT_PUBLIC':
      return [...state, action.publicId];
    case 'DESELECT_PUBLIC':
      return state.filter(publicId => publicId !== action.publicId);
    case 'SELECT_PUBLICS_ON_PAGE':
      return [...state, ...action.publicsId.filter(publicId => state.indexOf(publicId) === -1)];
    case 'DESELECT_PUBLICS_ON_PAGE':
      return state.filter(publicId => action.publicsId.indexOf(publicId) === -1);
    case 'DOWNLOAD_XLS':
      return [];
    default:
      return state;
  }
}
