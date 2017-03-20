import React from 'react';
import Tabs, { Panel } from 'react-simpletabs';
import Analytics from '../containers/analytics';
import PartnerPrograms from '../containers/partner_programs';
import AdsAndPosts from '../containers/ads_and_posts';
import LandingPage from '../containers/landing_page';
import SimilarOffers from '../containers/similar_offers';

export default () => (
  <Tabs tabActive={+location.hash.substr(1) || 2}>
    <Panel title="Аналитика" >
      <Analytics />
    </Panel>
    <Panel title="Партнерские программы" >
      <PartnerPrograms />
    </Panel>
    <Panel title="Объявления и посты" >
      <AdsAndPosts />
    </Panel>
    <Panel title="Посадочные страницы" >
      <LandingPage />
    </Panel>
    <Panel title="Похожие офферы" >
      <SimilarOffers />
    </Panel>
  </Tabs>
);

