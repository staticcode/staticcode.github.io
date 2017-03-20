import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Filters from './filters';
import Post from './post_template';
import Searchform from '../../../../../components/advertika/searchform';
import SelectDropdown from '../../../../../components/advertika/select-dropdown';
import Pagination from '../../../../../components/advertika/Pagination';
import ReactTooltip from '../../../../../components/react-tooltip/react-tooltip';
import { circlePreloader } from '../../../../../components/advertika/helpers';
import * as actions from '../actions/';
import NorificationSystem from 'react-notification-system';
import FreemiumMessage from './freemium_message';


class IGPosts extends Component {
  constructor(props) {
    super(props);


    this.state = {
      data: [],
    };


    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this._openNotification = this._openNotification.bind(this);
  }

  componentWillMount() {
    let cfg = {};
    if (location.search.length) {
      const search = location.search.substring(1);
      cfg = JSON.parse(
        `{"${decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      );
      this.props.changeFilter({ ...this.props.filter, ...cfg });
    }

    this.handleGetData({ ...this.props.filter, ...cfg });
  }

  _openNotification(message) {
    this.refs.notificationSystem.addNotification(message);
  }

  handleShowFilters() {
    this.refs.filters.handleShowFilters();
  }

  applyFilter() {
    this.props.changeFilter({ page: 1 });
    this.handleGetData({ page: 1 });
  }

  handleSearch(key, val) {
    this.props.changeFilter({ [key]: val, page: 1 });
  }

  changeFilter(key, val) {
    this.filter[key] = val;
  }

  handleSort(key, val) {
    this.props.changeFilter({ [key]: val, page: 1 });
    this.handleGetData({ [key]: val, page: 1 });
  }

  handlePagination(page) {
    this.props.changeFilter({ page });
    this.handleGetData({ page });
    $('body, html').animate({
      scrollTop: 0,
    }, 500);
  }

  handleGetData(cfg = {}) {
    this.setState({ loading: true });
    $.getJSON(
      '/public/ig/default/filter',
      { ...this.props.filter, ...cfg },
      result => {
        this.setState({
          loading: false,
          data: result.items,
          count: result.count,
        });
      }
    );
  }

  render() {
    const count = this.state.count;
    return (
      <div>
        {this.state.loading
          ? <div className="progress" style={{ position: 'fixed', zIndex: '999', top: '-10px', left: '0px' }}>
            <div className="indeterminate"></div>
          </div>
          : null}
        <Searchform
          ref="Searchform"
          classNames="[ col-65 mx-auto mb2 ]"
          placeholder="Введите текст, ссылку или операторы @ и #"
          onChange={this.handleSearch}
          onSubmit={this.applyFilter}
          name="search"
          value={this.props.filter.search}
          settings={[
            {
              placeholder: '@username',
              name: 'username',
              mask: '@',
            }, {
              placeholder: 'в описании',
              name: 'in_description',
              mask: '',
            }, {
              placeholder: 'website',
              name: 'website',
              mask: '',
            }, {
              placeholder: '#hashtag',
              name: 'hashtag',
              mask: '#',
            },
          ]}
        />
        <Filters
          ref="filters"
          className="public-ig_filters"
          applyFilter={this.applyFilter}
          changeFilter={this.changeFilter}
        />
        <div style={{ width: '100%', borderBottom: '1px solid #d5d5d5', position: 'absolute', left: '0px' }} />

        {this.state.data.length
          ? <div>
            <div className="row py2">
                <div className={cx('right col-20', { __locked: !window.access })}>
                  <SelectDropdown
                    {...sortDropdown}
                    checkedItem={this.props.filter.sort}
                    onChange={window.access && this.handleSort}
                  />
                </div>
                <div className="right a-right mxn1 py1">Сортировать по:</div>
                <div className="left col-50 py1">
                  Найдено
                  <span className="txt-success">
                    {` ${count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} `}
                  </span>
                  записей, отображены с
                  <span className="txt-success">
                    {` ${
                      ((limit * (this.props.filter.page || 1)) - (limit - 1))
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                    } `}
                  </span>
                  по
                  <span className="txt-success">
                    {` ${
                      (count > limit * (this.props.filter.page || 1)
                      ? limit * (this.props.filter.page || 1)
                      : count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                    }`}
                  </span>
                </div>
              </div>

              {!window.access &&
                <FreemiumMessage
                  freeBase={this.state.data.length}
                  datacount={count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />}

              <div className="posts-ig_list">
                {this.state.data.map(data => (

                  <div className="posts-ig_list-item" key={data.post.postId}>
                    <Post
                      {...data}
                      detailInfo
                      access={!!window.access}
                      notificationSystem={this._openNotification}
                    />
                  </div>

                ))}
              </div>
              <div className={cx({ __locked: !window.access })}>
                {count > limit &&
                  <Pagination
                    ref="pagination"
                    currentPage={this.props.filter.page}
                    maxVisible={Math.ceil(count / limit) > 5 ? 5 : Math.ceil(count / limit)}
                    max={Math.ceil(count / limit)} onChange={window.access && this.handlePagination}
                  />}
              </div>
          </div>
          : !this.state.loading
            ? <div className="public-ig_nodata center">
              <span className="p4">&#9785;</span>
                <p>
                  По вашему запросу ничего не найдено.
                </p>
                <p>
                  {`Попробуйте изменить `}
                  <span
                    className="txt-success"
                    onClick={this.handleShowFilters}
                  >
                    фильтры
                  </span>.
                </p>

            </div>
            : circlePreloader(300)
          }
        <NorificationSystem
          ref="notificationSystem"
          allowHTML
          style={{
            Containers: {

              tc: { top: '25%' },
            },
            NotificationItem: {
              DefaultStyle: { boxShadow: '0 0 30px rgba(0,0,0, .7)', padding: '20px' },
            },
          }}
        />
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}


IGPosts.propTypes = {
  filter: PropTypes.object,
  changeFilter: PropTypes.func,
};


function mapStateToProps(state) {
  return {
    filter: state.filter,
  };
}

export default connect(mapStateToProps, actions)(IGPosts);

