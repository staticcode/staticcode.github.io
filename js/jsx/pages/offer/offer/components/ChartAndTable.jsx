import React, { Component, PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// import _ from 'underscore';
import SortableTable from '../../../../components/react-sortable-table/sortable-table';
import Dropdown from '../../../../components/advertika/dropdown';
import Pagination from '../../../../components/advertika/Pagination';

class ChartAndTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdown: {
        items: this.props.dropdownData,
      },
      chartData: this.props.chartData,
      page: 1,
    };

    this.handleToggleSeries = this.handleToggleSeries.bind(this);
    this.toggleChekbox = this.toggleChekbox.bind(this);
    this.refresh = this.refresh.bind(this);
  }


  handleToggleSeries(name) {
    this.setState({
      chartData: this.state.chartData.map(item => (
        { ...item, visible: item.name === name ? !item.visible : item.visible }
      )),
    });
  }

  toggleChekbox(unuse, checkedInputs) {
    this.setState({
      chartData: this.state.chartData.map(item => (
        {
          ...item,
          visible: checkedInputs.indexOf(item.name) !== -1,
          checked: checkedInputs.indexOf(item.name) !== -1,
        }
      )),
    });
  }

  refresh() {
    this.setState({
      dropdown: {
        items: this.props.dropdownData,
      },
      chartData: this.props.chartData,
    });
    if (this.refs.dropdown) {
      this.refs.dropdown.refresh();
    }
  }


  changePage(page) {
    this.setState({ page });
  }

  render() {
    const { chartConfig, data, columns, style, children, limitDataTable } = this.props;
    const { chartData, dropdown, page } = this.state;
    const countTablePages = Math.ceil(data.length / limitDataTable);
    const startTableData = (limitDataTable * page) - limitDataTable;
    const endTableData = (limitDataTable * page);

    const checkboxes = checkboxesData => (
      checkboxesData.filter(c => c.checked).map(c => (
          <label key={c.name} className="cart-checkbox py1">
            <input
              type="checkbox"
              checked={c.visible}
              onChange={() => this.handleToggleSeries(c.name)}
            />
            <span style={c.visible ? { background: c.color } : null} />
            {c.name}
          </label>
       ))
    );

    const highChartData = { ...chartConfig, series: chartData.filter(chart => chart.visible) };

    return (
      <section style={style}>
        <h3>{children}</h3>
        {this.props.chartData.length !== 0
          ? <div>
            <div className="row px2">
              <div style={{ display: 'inline-block' }} className="left col-15 py1">
                <Dropdown
                  ref="dropdown"
                  items={dropdown}
                  onChange={this.toggleChekbox}
                  design="link"
                  positionClass="__ddright"
                  subtitle="+ Добавить"
                  noControls
                />
              </div>
              <div className="left col-85">
                {chartData && checkboxes(chartData)}
              </div>
            </div>
            <Highcharts config={highChartData} />
            <SortableTable
              className="tbl __center"
              data={data.slice(startTableData, endTableData) || []}
              columns={columns}
            />

              {data.length > limitDataTable &&
                <Pagination
                  ref="pagination"
                  currentPage={page}
                  maxVisible={countTablePages > 5 ? 5 : countTablePages}
                  max={countTablePages}
                  onChange={clickedPage => this.changePage(clickedPage)}
                />
              }

          </div>

          : <div className="note-user" >
              <span className="ion-android-search"></span>
              <span className="text">
                Недостаточно данных для построения графиков.
              </span>
            </div>
        }

      </section>
    );
  }
}

ChartAndTable.defaultProps = {
  limitDataTable: 10,
};

ChartAndTable.propTypes = {
  chartConfig: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.array,
  chartData: PropTypes.array,
  data: PropTypes.array,
  dropdownData: PropTypes.array,
  columns: PropTypes.array,
  limitDataTable: PropTypes.number,
};

export default ChartAndTable;
