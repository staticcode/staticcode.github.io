import { combineReducers } from 'redux';
import FiltersReducer from './reducer_filters';
import OffersDataReducer from './reducer_offers';
import TableConfigReducer from './reducer_table';


const rootReducer = combineReducers({
  filters: FiltersReducer,
  offersData: OffersDataReducer,
  tableConfig: TableConfigReducer,
});

export default rootReducer;
