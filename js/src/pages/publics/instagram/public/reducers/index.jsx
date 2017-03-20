import { combineReducers } from 'redux';
import ChartReducer from './reducer_chart';


const rootReducer = combineReducers({
  chart: ChartReducer,
});

export default rootReducer;
