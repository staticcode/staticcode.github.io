import { combineReducers } from 'redux';
import PostsReducer from './reducer_posts';
import FilterReducerView from './reducer_filter_view';
import FilterReducerConfig from './reducer_filter_config';
import VisibilityReducer from './reducer_visibility';


const rootReducer = combineReducers({
  filterView: FilterReducerView,
  filterConfig: FilterReducerConfig,
  visibility: VisibilityReducer,
  postsData: PostsReducer,
});

export default rootReducer;
