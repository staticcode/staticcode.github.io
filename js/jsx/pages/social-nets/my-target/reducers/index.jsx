import { combineReducers } from 'redux';
import TeasersReducer from './reducer_teasers';
import FilterReducerView from './reducer_filter_view';
import FilterReducerConfig from './reducer_filter_config';
import VisibilityReducer from './reducer_visibility';
import ToolbarProjectsReducer from './reducer_toolbar_projects';
import FilterCountsReducer from './reducer_filter_counts';
import SelectedTeasersReducer from './reducer_selected_teasers';
import FavoritesReducer from './reducer_in_fav';

const rootReducer = combineReducers({
  selectedTeasers: SelectedTeasersReducer,
  filterCounts: FilterCountsReducer,
  filterView: FilterReducerView,
  filterConfig: FilterReducerConfig,
  visibility: VisibilityReducer,
  toolbarProjects: ToolbarProjectsReducer,
  teasers: TeasersReducer,
  favorites: FavoritesReducer,
});

export default rootReducer;
