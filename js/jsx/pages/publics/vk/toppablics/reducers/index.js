import { combineReducers } from 'redux';
import tableConfig from './reducer_table_view';
import tableData from './reducer_table_data';

const rootReducer = combineReducers({
  tableConfig,
  tableData
});

export default rootReducer;
