
export default function (state = window.propsOfferсhoice(), action) {
  switch (action.type) {

    case 'RESET_STORE':
      return window.propsOfferсhoice();
    case 'CHANGE_HEAD_SOUTCE_TYPE':
      return {
        ...state,
        tableColumns: state.tableColumns.map((item, index) => (
          index === 2
            ? { ...item, header: state.sourceType[action.payload - 1] }
            : item
        )),
      };

    default:
      return state;
  }
}
