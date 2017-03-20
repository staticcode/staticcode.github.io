import React, { Component, PropTypes } from 'react';
import NorificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';

import Filters from './filters';
import DataTable from './data-table';
import ExcelDownloader from './excel-downloader';
import Modal from './modal';

import FlatLinePreloader from '../../../../../components/advertika/flat-line-preloader';
import numberWithSpaces from '../../../../../components/advertika/helpers/numberWithSpaces';

// import SortableTable from '../../../../../components/react-sortable-table/sortable-table';

import ReactTooltip from '../../../../../components/react-tooltip/react-tooltip';
import Searchform from '../../../../../components/advertika/searchform';
import Pagination from '../../../../../components/advertika/PaginationV2';


import * as actions from '../actions';

const mapStateToProps = ({ tableConfig, filterConfig, tableData, visibility, selectedIds }) => ({
  filterConfig,
  selectedIds,
  tableConfig,
  visibility,
  tableData,
});

@connect(mapStateToProps, actions)
export default class Toppablics extends Component {
  static propTypes = {
    inputField: PropTypes.string,
    tableConfig: PropTypes.array,
    selectedIds: PropTypes.array,
    filterConfig: PropTypes.object,
    tableData: PropTypes.object,
    visibility: PropTypes.object,
    changeFilter: PropTypes.func,
    fetchTableData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      loading: false,
      page: 1,
    };
  }


  handleSort(column, sort) {
    this.props.changeFilter({ column, sort });
    this.props.fetchTableData({ ...this.props.filterConfig, column, sort });
  }

  changePage(page) {
    this.props.changeFilter({ page });

    this.props.fetchTableData(this.props.filterConfig, page);
    window.scrollTo(0, 0);
  }

  changeSearch(name, inputField) {
    this.props.changeFilter({ inputField });
  }

  applyFilter() {
    this.props.fetchTableData(this.props.filterConfig);
  }

  handleShowNotification(message) {
    this.notificationSystem.addNotification(message);
  }

  changeLimit(limit) {
    this.props.changeFilter({ limit });
    this.props.fetchTableData({ ...this.props.filterConfig, limit });
  }

  render() {
    const {
      tableData,
      filterConfig,
      // tableConfig,
      visibility,
      selectedIds,
      toggleVisibility,
    } = this.props;

    const countPages = Math.ceil(tableData.totalCount / filterConfig.limit);
    return (
      <div>
        {visibility.loading && <FlatLinePreloader />}
        <div className="row">
          <Searchform
            ref="Searchform"
            name="inputField"
            classNames="col-60 offset-20 left mb2"
            placeholder="Введите название, id или ссылку на сообщество"
            rewritable
            onChange={this.changeSearch}
            onSubmit={this.applyFilter}
            value={filterConfig.inputField}
          />
          <div className="col-20 left a-right" style={{ paddingTop: '4px' }} >
            <button
              className="button __success __lg"
              style={{ fontWeight: 'normal' }}

              onClick={() => toggleVisibility({ modal: true })}
            >
              + Добавить сообщество
              </button>


          </div>
        </div>
        <Filters
          reset={this.resetFilters}
          // changeFilter={this.changeFilter}
          applyFilter={this.applyFilter}
          changeInputs={this.changeInputs}
        />
        {tableData.items.length &&
          <div style={{ marginTop: '145px' }}>
            <div className="row">
              <div className="col-33 left">
                <ExcelDownloader notificationSystem={this.handleShowNotification} />
              </div>
              <div className="col-33 left center" style={{ paddingTop: '8px' }}>
                {'Найдено '}
                <span className="txt-success">
                {!visibility.loading
                  ? numberWithSpaces(tableData.totalCount)
                  : '...'}
                </span>
                {' записей'}
              </div>
              <div className="col-33 left a-right" style={{ paddingTop: '8px' }}>
                <span>
                  На странице: {[20, 50, 100, 200].map(limit => (
                    <span
                      key={limit}
                      style={{ cursor: 'pointer' }}
                      className={String(filterConfig.limit) === String(limit) ? 'txt-success' : ''}
                      onClick={() => this.changeLimit(limit)}
                    >
                      {` ${limit}`}
                    </span>))}
                </span>
              </div>
            </div>

            {/* <SortableTable
              className="tbl __fzsm __center"
              data={tableData.items}
              onSort={this.handleSort}
              columns={tableConfig}
            /> */}

            <DataTable
              tableData={tableData.items}
              onSort={this.handleSort}
              notificationSystem={this.handleShowNotification}
            />

            <div className="center mb4">
            {!!tableData.items && tableData.items.length < tableData.totalCount &&

              <Pagination
                currentPage={filterConfig.page + 1}
                maxVisible={countPages > 5 ? 5 : countPages}
                max={countPages}
                onChange={page => this.changePage(page - 1)}
              />
            }
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
        <NorificationSystem

          ref={(notificationSystem) => { this.notificationSystem = notificationSystem; }}
          allowHTML
          style={{
            Containers: { tc: { top: '25%' }, DefaultStyle: { width: '400px', margin: '0 0 0 -200px' } },
            NotificationItem: {
              DefaultStyle: { boxShadow: '0 0 30px rgba(0,0,0, .7)', padding: '20px', fontSize: '16px' },
            },
          }}
        />
        <Modal />
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}
