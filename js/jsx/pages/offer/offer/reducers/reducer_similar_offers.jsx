
export default function (state = window.similarOffersInitialData(), action) {

  switch (action.type) {
    case 'TOGGLE_SO_PRELOADER':
      return {
        ...state,
        loading: action.payload,
      };
    case 'LOAD_SO_NEXT_DATA':
      return {
        ...state,
        loading: false,
        totalOffers: action.payload.totalOffers,
        filter: { ...state.filter, page: state.filter.page + 1 },
        data: [...state.data, ...action.payload.offers],
      };
    case 'LOAD_SO_SORTED_DATA':
      return {
        ...state,
        loading: false,
        totalOffers: action.payload.totalOffers,
        filter: { ...action.payload.filter },
        data: action.payload.offers,
        tableColumns: state.tableColumns.map(
          column => (
            {
              ...column,
              defaultSorting: column.key === action.payload.filter.column ? action.payload.filter.sort : 'both',
            }
          )
        ),
      };
    default:
      return state;
  }
}
