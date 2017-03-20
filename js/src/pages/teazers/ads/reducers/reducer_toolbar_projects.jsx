export default function (state = { savedProjects: [], teaserNetList: [] }, action) {
  switch (action.type) {
    case 'LOAD_NETS_LIST':
      return { ...state, teaserNetList: action.payload || [] };
    case 'LOAD_PROJECTS_LIST':
      return { ...state, savedProjects: action.payload || [] };
    case 'ADD_NEW_PROJECT':
      return {
        ...state,
        savedProjects: [action.payload, ...state.savedProjects.map(item => ({ ...item, selected: false }))],
      };
    default:
      return state;
  }
}
