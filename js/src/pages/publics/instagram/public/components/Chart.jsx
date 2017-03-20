import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'react-highcharts';
import Btn from '../../../../../components/advertika/btnitem';
import moment from 'moment';
import Datepicker from '../../../../../components/advertika/DateRangePicker';
import * as actions from '../actions';


class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleApplyDatepicker = this.handleApplyDatepicker.bind(this);
    this.handleSetDate = this.handleSetDate.bind(this);
    this.handleToggleSeries = this.handleToggleSeries.bind(this);
  }

  componentWillMount() {
    const { public_id, date, info_by } = this.props;
    this.props.fetchChartData({ public_id, date, info_by });
    this.props.fetchTabletData({ public_id, date });
  }

  changeChart(info_by) {
    const { public_id, date } = this.props;
    this.props.changeChart({ public_id, date, info_by }, info_by);
  }

  changeDateGroup(group) {
    const { public_id, date, info_by } = this.props;
    this.props.changeDateGroup({ public_id, date: { ...date, group }, info_by }, group);
  }


  handleSetDate(start, end) {
    const { public_id, date, info_by } = this.props;
    this.props.changeDate({ public_id, date: { ...date, start, end }, info_by }, { start, end });
  }

  handleApplyDatepicker() {

  }

  handleToggleSeries(i) {
    this.props.toggleChartSeries(i);
  }

  render() {
    const { controls, chartData, chartConfig, info_by, date, dateGroup } = this.props;

    const renderChartSelectors = list => list.map(btn => (
      <Btn
        style={{ marginLeft: 2, marginRight: 2 }}
        className={btn === info_by ? controls[btn].btnAtiveClass : controls[btn].btnClass}
        onClick={() => this.changeChart(btn)}
        key={btn}
        children={controls[btn].name}
      />
    ));

    const seriesButtons = series => series.map((c, i) => (
      <div
        className={`display-inline __xs ${c.visible ? '__primary' : ''}`}
        style={{
          marginLeft: 15,
          display: 'inline-block',
          fontSize: 12,
          cursor: 'pointer',
        }}
        key={c.name}
        onClick={this.handleToggleSeries.bind(this, i)}
      >
        <div style={{ height: 15, width: 15, display: 'inline-block', background: c.visible ? c.color : '#d5d5d5' }} />
        {' '}
        {c.name}
      </div>
    ));

    const renderRadioInputs = inputs => inputs.map(input => (
      <label key={input}>
        <input
          style={{ position: 'absolute', left: '-9999px' }}
          type="radio"
          checked={input === date.group}
          onChange={() => this.changeDateGroup(input)}
        />
        <div
          className={`jq-radio ${input === date.group ? 'checked' : ''}`}
          style={{ display: 'inline-block', marginRight: 4 }}
        />
        {dateGroup[input].title}
        {' '}
      </label>
    ));

    return (
      <div className="public-ig_chart">
        <div className="center mb1">
          {renderChartSelectors(Object.keys(controls))}
        </div>
        <div className="col-80 mx-auto mb1">
          <Datepicker
            ref="datepicker"
            // maxDate={moment()}
            // minDate={moment().subtract(90, 'days')}
            startDate={moment(date.start, 'DD MM YYYY')}
            endDate={moment(date.end, 'DD MM YYYY')}
            opens="right"
            setDate={this.handleSetDate}
            applyDate={this.handleApplyDatepicker}
          />
        </div>
        <div className="center">
          {renderRadioInputs(Object.keys(dateGroup))}
        </div>
        <div style={{ height: 300 }}>
          <Highcharts config={{ ...chartConfig, series: chartData }} />
        </div>
        <div>
          {(chartData.length > 1) && seriesButtons(chartData)}
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  fetchChartData: PropTypes.func,
  fetchTabletData: PropTypes.func,
  public_id: PropTypes.number,
  info_by: PropTypes.string,
  date: PropTypes.object,
  changeChart: PropTypes.func,
  changeDateGroup: PropTypes.func,
  changeDate: PropTypes.func,
  toggleChartSeries: PropTypes.func,
  controls: PropTypes.object,
  chartData: PropTypes.array,
  chartConfig: PropTypes.object,
  dateGroup: PropTypes.object,
};

const mapStateToProps = ({ chart: { controls, chartConfig, chartData, info_by, date, dateGroup, public_id } }) => ({
  controls,
  chartConfig: chartConfig[controls[info_by].chartCfg],
  chartData,
  info_by,
  date,
  dateGroup,
  public_id,
});

export default connect(mapStateToProps, actions)(Chart);
