import React from 'react';
import ReactDOM from 'react-dom';
import SortableTable from '../../components/react-sortable-table/sortable-table';
import Btnitem from '../../components/advertika/btnitem';
import Searchform from '../../components/advertika/searchform';
import ReactTooltip from '../../components/react-tooltip/react-tooltip';
import _ from 'underscore';

var SortedTableSample = React.createClass({
  filter:{},
  filterNextPage:{
    loadnext: true
  },
  getDefaultProps() {
    return propsOfferсhoice();
  },
   getInitialState() {
    return stateOfferсhoice();
  },
  componentDidMount() {
    Tipped.create('.tipped', function() {
      return {
        content: $(this).data('content')
      };
    });
  },
  componentDidUpdate() {
    Tipped.create('.tipped', function() {
      return {
        content: $(this).data('content')
      };
    });
  },
  resetFilters() {
    this.filter = {};
    this.replaceState(stateOfferсhoice());
    this.refs.Searchform.handleReset();
    this.props.dropdowns.forEach(c => this.refs[c.filterName].handleChange(() => false));
  },
  changeFilter(key, val) {
    this.filter[key] = val;
  },
  handleSort(column, sort) {
    this.filter.column = column;
    this.filter.sort = sort;
    this.filter.page = this.state.page - 1;
    this.setState({ loading: true });
    $.getJSON(this.props.url, this.filter, result => {
      this.setState({
        totalCount: result.totalCount,
        loading: false,
        data: result.dataList,
      });
      this.filterNextPage = _.extend(this.filterNextPage, this.filter);
    });
  },
  applyFilter() {
    this.filter.page = 0;
    this.setState({ loading: true });
    $.getJSON(this.props.url, this.filter, (result) => {
      if (this.isMounted()) {
        this.setState({
          totalCount: result.totalCount,
          loading: false,
          page: 1,
          data: result.dataList,
        });
      }
      this.filterNextPage = _.extend(this.filterNextPage, this.filter);
    });
  },
  loadNext() {
    this.filterNextPage.page = this.state.page;
    this.setState({ loading: true });
    $.getJSON(this.props.url, this.filterNextPage, (result) => {
      this.setState({
        totalCount: result.totalCount,
        page: this.state.page + 1,
        loading: false,
        data: this.state.data.concat(result.dataList),
      });
    });
  },
  render() {
    return (
      <div>
      {this.state.loading &&
        <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
          <div className="indeterminate"></div>
        </div>}

        <Searchform
          ref="Searchform"
          placeholder="Поиск по названию партнёрской сети"
          onChange={this.changeFilter}
          onSubmit={this.applyFilter}
          value={this.props.inputField}
        />
        <SortableTable
          onSort={this.handleSort}
          className="tbl __fzsm __center"
          data={this.state.data}
          columns={this.props.tableColumns} />
        <div className="center mb4">
          {this.state.data.length != this.state.totalCount &&
          <Btnitem
            className="__primary"
            onClick={ this.loadNext }
            disabled={ this.state.loading }
          >
            {!this.state.loading ? 'Загрузить еще' : 'Загрузка'}
          </Btnitem>}
          <div>
            <small>Отображается {this.state.data.length} из {this.state.totalCount}</small>
          </div>
        </div>
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
});


ReactDOM.render(<SortedTableSample />, document.getElementById('offerсhoice'));
