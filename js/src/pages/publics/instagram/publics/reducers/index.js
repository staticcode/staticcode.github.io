import { combineReducers } from 'redux';
import filterConfig from './reducer_filter_config';
import pageData from './reducer_page_data';
import filterView from './reducer_filter_view';
// import tableData from './reducer_table_data';
import visibility from './reducer_visibility';
import selectedIds from './reducer_selected_publics';
import downloadConfig from './reducer_download_config';

const rootReducer = combineReducers({
  downloadConfig,
  filterConfig,
  selectedIds,
  filterView,
  pageData,
  visibility,
  // tableData,
});

export default rootReducer;
