import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import NorificationSystem from 'react-notification-system';

import Checkbox from 'components/advertika/CheckboxV2';
import SelectDropdown from 'components/advertika/select-dropdown';
// import Searchform from 'components/advertika/searchform';
import Searchform from 'components/advertika/multi-searchform';
import Pagination from 'components/advertika/Pagination';
import ReactTooltip from 'components/react-tooltip/react-tooltip';
import { numberWithSpaces, circlePreloader } from 'components/advertika/helpers.jsx';

import * as actions from '../actions';
import Filters from './filters';
import Modal from './modal';
import ExcelDownloader from './excel-downloader';
import DataTable from './data-table';

const mapStateToProps = ({ visibility, filterConfig, pageData, selectedIds, filterView }) => ({
  visibility,
  filterConfig,
  filterView,
  pageData,
  selectedIds,
});

@connect(mapStateToProps, actions)
export default class IGPublics extends Component {
  static propTypes = {
    visibility: PropTypes.object,
    filterConfig: PropTypes.object,
    pageData: PropTypes.object,
    selectedIds: PropTypes.array,
    toggleVisibility: PropTypes.func,
    changeFilter: PropTypes.func,
    fetchData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }

  componentWillMount() {
    this.props.fetchData(this.props.filterConfig);
  }

  setDetailFilterProp(key, val) {
    this.filter[key] = val;
  }

  setPage(page = 1) {
    this.filter.page = page;
  }

  handleShowFilters() {
    this.refs.filters.handleShowFilters();
  }

  applyFilter() {
    this.props.fetchData(this.props.filterConfig);
  }

  handleSearch(key, val) {
    this.props.changeFilter({ [key]: val });
  }

  handleSort(sort) {
    this.props.changeFilter(sort);
    this.props.fetchData({ ...this.props.filterConfig, ...sort });
  }

  changeLimit(limit) {
    this.props.changeFilter({ limit });
    this.props.fetchData({ ...this.props.filterConfig, limit });
  }

  handlePagination(page) {
    this.props.changeFilter({ page });
    this.props.fetchData(this.props.filterConfig, page);
    $('body, html').animate({ scrollTop: 0 }, 500);
  }

  togglePageSelection(checked) {
    const { selectedIds, pageData, selectPublicsOnPage, deselectPublicsOnPage, filterView } = this.props;
    const ids = pageData.items.map(data => data.public.original_id);
    const canAddIds = 500 - selectedIds.length;
    if (checked) {
      if (canAddIds < ids.length) {
        this.notificationSystem.addNotification({
          message: 'Возможный лимит для выгрузки 500',
          level: 'warning',
          autoDismiss: 5,
          position: 'tc',
        });
        selectPublicsOnPage(ids.splice(0, canAddIds));
      } else {
        if (canAddIds === 0) {
          this.notificationSystem.addNotification({
            message: 'Возможный лимит для выгрузки 500',
            level: 'warning',
            autoDismiss: 5,
            position: 'tc',
          });
        } else {
          selectPublicsOnPage(ids);
        }
      }
    } else {
      deselectPublicsOnPage(ids);
    }
  }


  handleShowNotification(message) {
    this.notificationSystem.addNotification(message);
  }

  render() {
    const { toggleVisibility, visibility, pageData: { count, items }, filterConfig, selectedIds, filterView } = this.props;
    const countIdsContainInSelected = selectedIds.filter(
      teaserId => items.map(data => data.public.original_id).indexOf(teaserId) > -1
    ).length;

    return (
      <div>
        {!!visibility.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>}
          <div className="border-bottom">
            <div className="clearfix mb2 container">
              <div className="left center" style={{ paddingTop: '4px', width: '310px' }} >
                <button
                  style={{ fontWeight: 'normal' }}
                  className="button __success __lg"
                  onClick={() => toggleVisibility({ modal: true })}
                >
                  + Добавить сообщество
                </button>

              </div>
              <div
                className=" left "
                style={{ width: 'calc(100% - 675px)' }}
              >
                <Searchform
                  ref="Searchform"
                  classNames=" mx-auto"
                  style={{ maxWidth: '800px' }}
                  placeholder="Введите текст, ссылку или операторы @ и #"
                  name="search"
                  values={filterConfig}
                  onChange={this.props.changeFilter}
                  onSubmit={this.applyFilter}
                  inputs={[
                    {
                      placeholder: 'Найти',
                      id: 'serch_string',
                      name: 'search',
                      // mask: '@',
                    }, {
                      placeholder: '@username',
                      name: 'username',
                      mask: '@',
                    }, {
                      placeholder: 'в описании',
                      name: 'in_description',
                      // mask: '',
                    }, {
                      placeholder: 'website',
                      name: 'website',
                      // mask: '',
                    }, /*{
                      placeholder: '#hashtag',
                      name: 'hashtag',
                      mask: '#',
                    },*/
                  ]}
                />

              </div>

              <div
                className={cx('left', { __locked: !window.access })}
                style={{ width: '365px', paddingTop: '4px' }}
              >
                <SelectDropdown
                  {...filterView.sort}
                  wrapStyle={{ width: '250px', float: 'right' }}

                  checkedItem={filterConfig.sort}
                  onChange={(key, val) => this.handleSort({ [key]: val })}
                />
                <div className="right p1" >
                  Сотрировка:
                </div>
              </div>
            </div>
          </div>
        <div className="l-ft">
          <div>
            <Filters
              ref="filters"
              className={cx('c-vertical-filter', { __locked: !window.access })}
              applyFilter={window.access && this.applyFilter}
              changeFilter={window.access && this.changeFilter}
              setDetailFilterProp={this.setDetailFilterProp}
            />


          </div>
          <div>
            {items.length > 0
              ?<div className={!!visibility.loading ? '__data-fetching' : ''}>
                <div className="py2 row">
                  <div className="left col-40">
                    <Checkbox
                      style={{
                        float: 'left',
                        marginTop: '7px',
                      }}
                      checked={items.length === countIdsContainInSelected}
                      partChecked={countIdsContainInSelected && countIdsContainInSelected !== items.length}
                      onChange={event => this.togglePageSelection(event.target.checked)}
                    />
                    <ExcelDownloader notificationSystem={this.handleShowNotification} />
                  </div>

                    <div className="left col-35 py1 ">
                      Найдено
                      <span className="txt-success">
                        {` ${numberWithSpaces(count)} `}
                      </span>
                      записей
                    </div>
                    <div className="left col-25 py1 a-right">
                      <span>
                        На странице: {[40, 100, 200].map(limit => (
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

                  <DataTable />

                  {(count > filterConfig.limit) &&
                    <Pagination
                      ref="pagination"
                      currentPage={filterConfig.page}
                      maxVisible={Math.ceil(count / filterConfig.limit) > 5 ? 5 : Math.ceil(count / filterConfig.limit)}
                      max={Math.ceil(count / filterConfig.limit)}
                      onChange={this.handlePagination}
                    />}
              </div>
              : !visibility.loading
                ? <div className="public-ig_nodata center">
                  <span className="p4">&#9785;</span>
                    <p>По вашему запросу ничего не найдено.</p>
                    <p>Попробуйте изменить фильтры </p>
                </div>
                : circlePreloader(300)
              }


          </div>
        </div>
        <div style={{ width: '100%', borderBottom: '1px solid #d5d5d5', position: 'absolute', left: 0 }} />
        <Modal />
        <NorificationSystem
          ref={(node) => { this.notificationSystem = node; }}
          allowHTML
          style={{
            Containers: { tc: { top: '25%' }, DefaultStyle: { width: '400px', margin: '0 0 0 -200px' } },
            NotificationItem: {
              DefaultStyle: { boxShadow: '0 0 30px rgba(0,0,0, .7)', padding: '20px', fontSize: '16px' },
            },
          }}
        />
      </div>
    );
  }
}



