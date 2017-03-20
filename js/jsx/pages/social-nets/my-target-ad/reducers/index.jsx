import { combineReducers } from 'redux';
import TabsDataReducer from './reducer_tabs_data';


import VisibilityReducer from './reducer_visibility';


import SelectedTeasersReducer from './reducer_selected_teasers';
import FavoritesReducer from './reducer_in_fav';

const rootReducer = combineReducers({
  selectedTeasers: SelectedTeasersReducer,
  visibility: VisibilityReducer,
  tabsData: TabsDataReducer,
  favorites: FavoritesReducer,
});

export default rootReducer;
