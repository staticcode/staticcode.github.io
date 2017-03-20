import React from 'react';
import Highcharts from 'react-highcharts';
import Btn from '../../../../../../components/advertika/btnitem';


const Chart = React.createClass({

  getInitialState() {
    return {
      data: this.props.data
    };
  },

  handleToggleChart(i) {
    this.state.data.forEach((c, index) => c.visible = index == i);
    this.setState({ data: this.state.data });
  },

  render() {
    const chartSelector = this.state.data.map((c, i) => (
      <Btn
        className={`${c.visible ? '__primary' : ''} __sm`}
        onClick={this.handleToggleChart.bind(this, i)}
        key={c.title}
        children={c.title}
      />
    ));


    const highChartData = this.props.config;
    highChartData.series = this.state.data.filter(c => c.visible);

    return (
      <section className="mb4">
      <div className="row">
        <div className="col-30 left">
          <h3>{this.props.children}</h3>
        </div>
        <div className="col-70 left a-right">
          {chartSelector}
        </div>
      </div>
      {!!this.props.data.length
        ? <Highcharts config={highChartData} />
        : <div className="p4 m4 center h3">
          В сообществе не наблюдалась активность за последние 30 дней
        </div>
      }

      </section>
    );
  }
});

export default Chart;
