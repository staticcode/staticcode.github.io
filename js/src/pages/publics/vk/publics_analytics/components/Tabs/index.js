import React, { Component, Proptypes } from 'react';
import Tabs from 'react-simpletabs';

import Statistics from '../Statictics';
import Posts from '../Posts';
import Ads from '../Ads';


export default class PublicAnalytics extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const activeTab = +location.hash.substr(1) || 1;
    return (
      <Tabs tabActive={activeTab}>
        <Tabs.Panel title="Статистика">
          <Statistics />
        </Tabs.Panel>
        <Tabs.Panel title="Посты">
          <Posts />
        </Tabs.Panel>

        {window.isManage &&
        <Tabs.Panel title="Реклама в сообществе">
          <Ads />
        </Tabs.Panel>}

      </Tabs>
    );
  }
}

