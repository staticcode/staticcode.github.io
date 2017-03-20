
export default function (state = { totalOffers: 0, offers: [], loading: false }, action) {
  switch (action.type) {
    case 'TOGGLE_PRELOADER':
      return { ...state, ...{ loading: !state.loading } };
    case 'RESET_STORE':
      return { totalOffers: 0, offers: [], loading: false };
    case 'LOAD_FILTERED_DATA':
      return {
        ...state,
        offers: action.payload.offers,
        totalOffers: action.payload.totalOffers,
        loading: !state.loading,
      };
    case 'LOAD_SORTED_DATA':
      return {
        ...state,
        offers: action.payload.offers,
        totalOffers: action.payload.totalOffers,
        loading: !state.loading,
      };
    case 'LOAD_NEXT_DATA':
      return {
        ...state,
        offers: [...state.offers, ...action.payload.offers],
        totalOffers: action.payload.totalOffers,
        loading: !state.loading,
      };
    default:
      return state;
  }
}
