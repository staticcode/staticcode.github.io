import React, { Component } from 'react';
import { connect } from 'react-redux';
import { numberWithSpaces, flatLinePreloader } from '../../../../components/advertika/helpers';
import Searchform from '../../../../components/advertika/searchform';
import WrapperDropdown from '../../../../components/advertika/wrapper-dropdown';
import TeaserTemplate from '../../../../components/advertika/mytarget_ad_template';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import Pagination from '../../../../components/advertika/Pagination';
import Filters from './filters';
import NoResults from './no_result';
import FreemiumMesage from './freemium_message';
import Masonry from 'react-masonry-component';
import * as actions from '../actions/';
import Toolbar from './toolbar';
import NorificationSystem from 'react-notification-system';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeSort = this.changeSort.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeLimit = this.changeLimit.bind(this);
    this.toggleTeaserSelection = this.toggleTeaserSelection.bind(this);
    this.toggleAllTeasersSelection = this.toggleAllTeasersSelection.bind(this);
    this.selectGroupTeasers = this.selectGroupTeasers.bind(this);
    this._openNotification = this._openNotification.bind(this);

    // this.addTooFavorites = this.addTooFavorites.bind(this);
  }

  componentWillMount() {

  }

  _openNotification(message) {
    this.refs.notificationSystem.addNotification(message);
  }

  exportsAds(method, ids = this.props.selectedTeasers, notificationSystem = this._openNotification) {
    if (ids.length === 0) {
      return notificationSystem({
        message: 'Не выбрано ни одно объявление!',
        level: 'error',
        autoDismiss: 5,
        position: 'tc',
      });
    }

    if (ids.length > 300) {
      notificationSystem({
        message: `При выгрузке в ${method}, за раз не более 300 объявлений`,
        level: 'success',
        autoDismiss: 0,
        position: 'tc',
      });
    }

    window.location = `/zip/mtm?method=${method}&ads=${ids.filter((c, i) => i < 300).join(',')}`;
    return null;
  }

  toggleTeaserSelection(id, { target: { checked } }) {
    if (!checked) {
      this.props.selectTeaser(id);
    } else {
      this.props.deselectTeaser(id);
    }
  }

  toggleAllTeasersSelection({ target: { checked } }) {
    const ids = this.props.teasers.items.map(teaser => teaser.id);
    if (checked) {
      this.props.selectGroupTeasers(ids);
    } else {
      this.props.deselectGroupTeasers(ids);
    }
  }

  selectGroupTeasers() {
    const ids = this.props.teasers.items.map(teaser => teaser.id);
    this.props.selectGroupTeasers(ids);
  }

  changePage(page) {
    this.props.changeFilter({ page });
    this.props.fetchTeasers({ ...this.props.filterConfig, ...{ page } });
    window.scrollTo(0, 0);
  }

  changeLimit(limit) {
    const { filterConfig } = this.props;
    const page = (Math.floor(((filterConfig.page - 1) * filterConfig.limit) / limit) + 1);
    this.props.changeFilter({ limit, page });
    this.props.fetchTeasers({ ...filterConfig, ...{ limit, page } });
  }

  changeSort(value) {
    this.refs.sort.handleCloseDropdown();
    const { filterConfig } = this.props;
    this.props.changeFilter({ sort: value });
    this.props.fetchTeasers({ ...filterConfig, sort: value });
  }

  render() {
    const sort = [
      { id: '1', name: 'Новизне' },
      { id: '2', name: 'Времени жизни' },
      { id: '3', name: 'Популярности' },
    ];

    const {
      deselectAllTeasers,
      incrementFavoritesCoun,
      decrementFavoritesCoun,
      teasers,
      filterConfig,
      selectedTeasers,
      visibility,
    } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        {visibility.loading && flatLinePreloader()}

        <div className="clearfix mb1">

          <Searchform
            {...{
              classNames: 'left px1',
              placeholder: 'Введите ключевое слово или фразу',
              style: {
                maxWidth: '770px',
                width: 'calc(100% - 680px)',
                marginLeft: '320px',
              },
              name: 'search',
              rewritable: true,
              value: this.props.filterConfig.search,
            }}
            onChange={(name, value) => this.props.changeFilter({ [name]: value })}
            onSubmit={() => this.props.fetchData(this.props.filterConfig)}
            autoComplete="off"
          />

          <div className="right px2" style={{ paddingTop: '3px' }}>
            <span>Сортировать по: </span>
            <WrapperDropdown
              ref="sort"
              positionClass="__ddleft"
              wrapStyle={{ width: '185px', display: 'inline-block' }}
              title={
                sort.filter(item => item.id === String(filterConfig.sort))[0].name
              }

              applySelected={this.applyFilter}
            >
              <ul>
              {sort.map((item, i) => (
                <li
                  key={i}
                  className={item.id === String(filterConfig.sort) ? '__active' : ''}
                  onClick={() => this.changeSort(item.id)}
                >
                  {item.name}
                </li>
              ))}
              </ul>
            </WrapperDropdown>
          </div>
        </div>

        <div className="l-ft">
          <div>
            <Filters ref="filter" />
          </div>
          <div className={!!this.props.visibility.loading ? '__data-fetching' : ''}>
            <div className="clearfix py1 ">
              <div className="left col_half">
                {'Найдено объявлений: '}
                <span className="txt-success">
                  {window.access
                    ? (!this.props.visibility.loading ? numberWithSpaces(teasers.count) : 'загрузка...')
                    : (this.props.visibility.freemiumCounter ? numberWithSpaces(teasers.freemiumCount) : 'загрузка...')
                  }
                </span>
              </div>
              <div className="left col_half a-right">
                <span>
                  На странице: {['50', '100', '200'].map(limit => (
                    <span
                      key={limit}
                      style={{ cursor: 'pointer' }}
                      className={String(this.props.filterConfig.limit) === String(limit) ? 'txt-success' : ''}
                      onClick={() => this.changeLimit(limit)}
                    >
                      {` ${limit}`}
                    </span>))}
                </span>
              </div>
            </div>
            <div className="teasers-list">
            {!window.access &&
              <FreemiumMesage
                teasercount={teasers.freemiumCount && numberWithSpaces(teasers.freemiumCount)}
                freeBase={teasers.count}
                freemiumCounterVisibility={this.props.visibility.freemiumCounter}
              />}

            {(!this.props.visibility.loading && !this.props.teasers.items.length && window.access) &&
              <NoResults search={filterConfig.search} />}

            <Masonry
              className={'mx-auto'} // default ''
              // elementType={'img'} // default 'div'
              options={{
                // columnWidth: 5,
                // "gutter": 10,
                isFitWidth: true,
                // itemSelector: '.m-teaser',
                singleMode: true,
                isResizable: true,
                isAnimated: true,
                animationOptions: {
                  queue: false,
                  duration: 500,
                },
              }}
              disableImagesLoaded={false} // default false
              updateOnEachImageLoad // default false and works only if disableImagesLoaded is false
            >
            {this.props.teasers.items.map(teaser => (
              <TeaserTemplate
                {...{ ...teaser, incrementFavoritesCoun, decrementFavoritesCoun, exportsAds: this.exportsAds }}
                key={teaser.id}
                selected={selectedTeasers.indexOf(teaser.id) !== -1}
                toggleTeaserSelection={this.toggleTeaserSelection}
                openNotification={this._openNotification}
              />
            ))}
            </Masonry>

              {(+this.props.teasers.count > +this.props.filterConfig.limit) &&
                <Pagination
                  ref="pagination"
                  currentPage={+this.props.filterConfig.page}
                  maxVisible={
                    Math.ceil(this.props.teasers.count / this.props.filterConfig.limit) > 5
                    ? 5
                    : Math.ceil(this.props.teasers.count / this.props.filterConfig.limit)
                  }
                  max={Math.ceil(this.props.teasers.count / this.props.filterConfig.limit)}
                  onChange={this.changePage}
                />
              }

            </div>
          </div>
        </div>
        <Toolbar
          {...{
            selectedTeasers,
            deselectAllTeasers,
            notification: this._openNotification,
            selectGroupTeasers: this.selectGroupTeasers,
            exportToZip: () => this.exportsAds('zip'),
          }}
        />
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

App.propTypes = {
  selectedTeasers: React.PropTypes.array,
  visibility: React.PropTypes.object,
  filterConfig: React.PropTypes.object,
  savedFilters: React.PropTypes.object,
  teasers: React.PropTypes.object,
  changeFilter: React.PropTypes.func,
  fetchTeasers: React.PropTypes.func,
  fetchData: React.PropTypes.func,
  addNewProject: React.PropTypes.func,
  toolbarProjects: React.PropTypes.object,
  addTeasersToProject: React.PropTypes.func,
  incrementFavoritesCoun: React.PropTypes.func,
  decrementFavoritesCoun: React.PropTypes.func,
  loadProjectsList: React.PropTypes.func,
  loadNetList: React.PropTypes.func,
  deselectAllTeasers: React.PropTypes.func,
  selectTeaser: React.PropTypes.func,
  deselectTeaser: React.PropTypes.func,
  selectGroupTeasers: React.PropTypes.func,
  deselectGroupTeasers: React.PropTypes.func,

};


function mapStateToProps({
  visibility,
  filterConfig,
  teasers,
  savedFilters,
  selectedTeasers,
  favorites,
  toolbarProjects,
}) {
  return {
    visibility,
    filterConfig,
    teasers,
    savedFilters,
    selectedTeasers,
    favorites,
    toolbarProjects,
  };
}

export default connect(mapStateToProps, { ...actions })(App);
