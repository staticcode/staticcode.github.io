import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import Filters from './filters';
import SortableTable from '../../../../../components/react-sortable-table/sortable-table';
import Btn from '../../../../../components/advertika/btnitem';
import ReactTooltip from '../../../../../components/react-tooltip/react-tooltip';
import Searchform from '../../../../../components/advertika/searchform';

const mapStateToProps = ({ tableConfig, tableData }) => ({
  tableConfig,
  tableData,
});

@connect(mapStateToProps)
export default class Toppablics extends Component {
  static propTypes = {
    url: PropTypes.string,
    inputField: PropTypes.string,
    tableConfig: PropTypes.array,
    tableData: PropTypes.array,
  };

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      // ...window.stateToppablics(),
      loading: false,
      page: 1,
    };

    this.filter = {
      column: 'audience',
      sort: 'desc',
      inputField: window.filterData.search || '',
    };

    // this.resetFilters = this.resetFilters.bind(this);
    // this.changeFilter = this.changeFilter.bind(this);
    // this.changeInputs = this.changeInputs.bind(this);
    // this.handleSort = this.handleSort.bind(this);
    // this.applyFilter = this.applyFilter.bind(this);
    // this.loadNext = this.loadNext.bind(this);
  }

  resetFilters() {
    delete this.filter.category;
    delete this.filter.country;
  }

  changeFilter(key, val) {
    if (val) {
      this.filter[key] = val;
    } else {
      delete this.filter[key];
    }
  }

  changeInputs(group, name, val) {
    if (!val.from && !val.to) {
      delete this.filter[name];
    } else {
      this.filter[name] = val;
    }
  }

  handleSort(column, sort) {
    this.filter.column = column;
    this.filter.sort = sort;
    this.filter.page = this.state.page - 1;
    this.setState({ loading: true });
    window.$.getJSON(this.props.url, this.filter, result => {
      this.setState({
        totalCount: result.totalCount,
        loading: false,
        items: result.items,
      });
    });
  }

  applyFilter() {
    this.filter.page = 0;
    this.setState({ loading: true });
    window.$.getJSON(this.props.url, this.filter, result => {
      this.setState({
        totalCount: result.totalCount,
        loading: false,
        page: 1,
        items: result.items,
      });
    });
  }

  loadNext() {
    this.filter.page = this.state.page;
    this.setState({ loading: true });
    window.$.getJSON(this.props.url, { ...this.filter, loadnext: true }, result => {
      this.setState({
        totalCount: result.totalCount,
        page: this.state.page + 1,
        loading: false,
        items: this.state.items.concat(result.items),
      });
    });
  }

  render() {
    const { tableData } = this.props;
    return (
      <div>
        {this.state.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>}
        <Searchform
          ref="Searchform"
          name="inputField"
          placeholder="Введите название, id или ссылку на сообщество"
          onChange={this.changeFilter}
          onSubmit={this.applyFilter}
          value={this.props.inputField}
        />
        <Filters
          reset={this.resetFilters}
          changeFilter={this.changeFilter}
          applyFilter={this.applyFilter}
          changeInputs={this.changeInputs}
        />


        {tableData.items.length &&
          <div style={{ marginTop: '165px' }}>

            <SortableTable
              className="tbl __fzsm __center"
              data={tableData.items}
              onSort={this.handleSort}
              columns={this.props.tableConfig}
            />

            <div className="center mb4">

            {(Number(tableData.items.length) !== Number(this.state.totalCount)) &&
              <Btn
                className="__primary"
                onClick={ this.loadNext }
                disabled={ this.state.loading }
              >
                {!this.state.loading ? 'Загрузить еще' : 'Загрузка'}
              </Btn>}

              <div>
                <small>{`Отображается ${tableData.items.length} из ${this.state.totalCount}`}</small>
              </div>
            </div>
          </div>
          }

          {(!tableData.items.length && !this.state.loading) &&

          <div className="py4 center" style={{ marginTop: '125px' }}>
            <span className="p4 inline-block" style={{ fontSize: '140px', color: '#d1d1d1' }}>&#9785;</span>
            <div>
              <p className="h2">По заданным параметрам поиска результаты отсутствуют.</p>
              <p className="h2">Измените настройки фильтров или поисковый запрос.</p>
            </div>
          </div>
          }
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}

Toppablics.defaultProps = {
  url: '/public/vk/default/filter',
};
