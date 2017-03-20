function toggleGeoItem(geioItems, id, checked) {
  if (Array.isArray(id)) {
    switch (checked) {
      case false:
        return geioItems.filter(item => id.indexOf(item) === -1); // удаляем переданные елементы
      case true:
        return [...geioItems, ...id]; // добавляем переданные елементы
      default :
        return id; // заменяем все переданным массивом
    }
  }

  if (checked && geioItems.indexOf(id) === -1) { // добавляем елемент
    return [...geioItems, id];
  }

  return geioItems.filter(element => element !== id); // удаляем елемент
}


export default function (state = window.filterConfig(), action) {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return { ...state, ...action.payload };
    case 'TOGGLE_GEO_DROPDOWN':
      return { ...state, geo_id: toggleGeoItem(state.geo_id || [], action.payload.id, action.payload.checked) };
    case 'RESET_FILTER':
      return window.filterConfig();
    default:
      return state;
  }
}

