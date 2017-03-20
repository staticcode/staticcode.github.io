import React from 'react';
import Highcharts from 'react-highcharts';
import { connect } from 'react-redux';
import { fetchData } from '../actions/';
import { circlePreloader } from '../../../../components/advertika/helpers';
import FreemiumMessage from './freemium_message';


class NumbesImpressions extends React.Component {
  static defaultProps = {
    countView: [],
  };

  static propTypes = {
    countView: React.PropTypes.array,
    fetchData: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (!this.props.countView.length && window.access) {
      const { id } = window.adInfo;
      this.props.fetchData({ method: 'countView', params: { id } }, 'countView');
    }
  }

  render() {
    if (!window.access) {
      return <FreemiumMessage message="График количества показов недоступен в бесплатном тарифе." />;
    }

    const { countView } = this.props;


    if (!countView.length) {
      return circlePreloader(200);
    }

    if (countView[0].data.length < 2) {
      return (<div className="h2 txt-disabled p4 m4 center">
          Слишком короткий период показа для выбранного объявления.
        </div>);
    }

    return (

      <Highcharts config={{ ...window.highchartConfig, series: countView }} />

    );
  }
}

export default connect(({ tabsData: { countView } }) => ({ countView }), { fetchData })(NumbesImpressions);
