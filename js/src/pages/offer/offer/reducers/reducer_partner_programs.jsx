
export default function (state = window.partnerProgramsInitialData(), action) {

  switch (action.type) {
    case 'RESET_PP_STORE':
      return window.partnerProgramsInitialData();
    case 'TOGGLE_PP_PRELOADER':
      return {
        ...state,
        loading: action.payload,
      };
    case 'TOGGLE_PP_STATUS':
      return {
        ...state,
        ...action.payload,
      };
    case 'CHANGE_PP_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'LOAD_PP_NEXT_DATA':
      return {
        ...state,
        loading: false,
        totalGoals: action.payload.totalGoals,
        filter: { ...state.filter, page: state.filter.page + 1 },
        data: [...state.data, ...action.payload.goals],
      };
    case 'LOAD_PP_SORTED_DATA':
      return {
        ...state,
        loading: false,
        totalGoals: action.payload.totalGoals,
        filter: { ...action.payload.filter },
        data: action.payload.goals,
        tableColumns: state.tableColumns.map(
          column => (
            {
              ...column,
              defaultSorting: column.key === action.payload.filter.column ? action.payload.filter.sort : 'both',
            }
          )
        ),
      };
    case 'LOAD_PP_FILTERED_DATA':
      return {
        ...state,
        totalGoals: action.payload.totalGoals,
        loading: false,
        filter: { ...state.filter, page: 1 },
        data: action.payload.goals,
      };
    default:
      return state;
  }
}
