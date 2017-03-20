import { combineReducers } from 'redux';
import FilterRedicer from './reducer_filter';


const rootReducer = combineReducers({
  filter: FilterRedicer,
});

export default rootReducer;
