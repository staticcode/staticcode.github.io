let cfg = {};
if (location.search.length) {
  const search = location.search.substring(1);
  cfg = JSON.parse(
    `{"${decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
  );
}

export default function (state = { ...window.filterConfig(), ...cfg }, action) {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return { ...state, page: 1, ...action.filter };
    case 'RESET_FILTER':
      return window.filterConfig();
    default:
      return state;
  }
}
