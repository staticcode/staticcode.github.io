import React from 'react';
import Tabs, { Panel } from 'react-simpletabs';
import SimilarImages from './similar_images';
import AdsCurrentLink from './ads_current_link';
import NumbesImpressions from './numbes_impressions';

export default class tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="page-bottom">
        <Tabs tabActive={1}>
          <Panel title="Похожие изображения" >
            <SimilarImages />
          </Panel>
          <Panel title="Объявления по текущей ссылке" >
            <AdsCurrentLink />
          </Panel>
          <Panel title="Количество показов" >
            <NumbesImpressions />
          </Panel>
        </Tabs>
      </div>
    );
  }
}
