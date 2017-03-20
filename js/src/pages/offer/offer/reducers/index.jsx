import { combineReducers } from 'redux';
// import FiltersReducer from './reducer_filters';
// import OffersDataReducer from './reducer_offers';
import PartnerProgramsReducer from './reducer_partner_programs';
import AdsAndPostsReducer from './reducer_ads_and_posts';
import LandingPageReducer from './reducer_landing_page';
import AnalyticsReducer from './reducer_analytics';
import SimilarOffersReducer from './reducer_similar_offers';


const rootReducer = combineReducers({
  PartnerPrograms: PartnerProgramsReducer,
  AdsAndPosts: AdsAndPostsReducer,
  LandingPage: LandingPageReducer,
  Analytics: AnalyticsReducer,
  SimilarOffers: SimilarOffersReducer,
});

export default rootReducer;
