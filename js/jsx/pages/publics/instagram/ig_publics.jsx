import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import cx from 'classnames';
import Filters from './publics/filters';
import Public from './publics/public_template';


import Searchform from '../../../components/advertika/searchform';
import Dropdown from '../../../components/advertika/dropdown';

import Pagination from '../../../components/advertika/Pagination';
import ReactTooltip from '../../../components/react-tooltip/react-tooltip';
import { numberWithSpaces, circlePreloader } from '../../../components/advertika/helpers.jsx';


class IGPublics extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this.filter = {
      filter: 'public',
      page: 1,
      limit: 40,
      is_open: true,
      is_close: true,
      only_adv: false,
      er_period: 0,
    };

    this.setDetailFilterProp = this.setDetailFilterProp.bind(this);
    this.setPage = this.setPage.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
  }


  componentWillMount() {
    if (location.search.length) {
      let search = location.search.substring(1);
      let cfg = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      // console.log(cfg)
      // _.extend(this.filter, cfg)
      this.filter = {...this.filter, ...cfg};
      ddown.items.forEach(c => c.checked = c.id == cfg.sort);
/*            this.state.data.forEach(
        (c,i)=> {
          if(c.visible = c.cfg.typePost == cfg.typePost){
            this.state.activeTable = i;
            c.cfg = _.extend(c.cfg, cfg);
            this.applyFilter()
            console.log(this.state.data[this.state.activeTable].cfg)
          }
        }
      )   */
    }
    this.handleGetData();
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
    this.setPage();
    this.handleGetData();
  }

  handleSearch(key, val) {
    this.filter[key] = val;
    this.setPage();
  }

  changeFilter(key, val) {
    this.filter[key] = val;
  }

  handleSort(key, val) {
    this.filter[key] = val[0];
  }


  handlePagination(page) {
    this.filter.page = page;
    this.handleGetData();
    $('body, html').animate({ scrollTop: 0 }, 500);
  }

  handleGetData() {
    this.setState({ loading: true });
    $.getJSON('/public/ig/default/filter', this.filter, (result) => {
      this.setState({
        loading: false,
        data: result.items,
        count: result.count,
      });
    });
  }

  render() {
    const count = this.state.count;
    return (
      <div>
        {!!this.state.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>}
        <Searchform
          ref="Searchform"
          classNames="[ col-65 mx-auto mb2 ]"
          placeholder="Введите текст, ссылку или операторы @ и #"
          name="search"
          onChange={this.handleSearch}
          onSubmit={this.applyFilter}
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
          className={cx('public-ig_filters', { __locked: !window.access })}
          applyFilter={window.access && this.applyFilter}
          changeFilter={window.access && this.changeFilter}
          setDetailFilterProp={this.setDetailFilterProp}
        />
        <div style={{ width: '100%', borderBottom: '1px solid #d5d5d5', position: 'absolute', left: 0 }} />
        {this.state.data.length > 0
          ?<div>
            <div className="row py2">
                <div className={cx('right col-20', { __locked: !window.access })}>
                  <Dropdown
                    {...window.ddown}
                    items={window.ddown}
                    onChange={window.access && this.handleSort}
                    applySelected={window.access && this.applyFilter}
                  />
                </div>
                <div className="right a-right mxn1 py1">
                  Сортировать по:
                </div>

                <div className="left col-50 py1">
                  Найдено
                  <span className="txt-success">{` ${numberWithSpaces(count)} `}</span>
                  записей, отображены с
                  <span className="txt-success">{` ${numberWithSpaces((limit*(this.filter.page || 1)) - (limit - 1))} `}</span>
                  по
                  <span className="txt-success">{` ${numberWithSpaces(count > limit*(this.filter.page || 1)?limit*(this.filter.page || 1):count)}`}</span>
                </div>
              </div>

              <div className="public-ig_list">
                {this.state.data.map((data, i) => <Public {...data} key={data.public.original_id} access={access} />)}
              </div>
              {(count > limit) &&
                <Pagination
                  ref="pagination"
                  currentPage={this.filter.page}
                  maxVisible={Math.ceil(count/limit) > 5 ? 5 : Math.ceil(count/limit)}
                  max={Math.ceil(count/limit)}
                  onChange={this.handlePagination}
                />}
          </div>
          :!this.state.loading
            ?<div className="public-ig_nodata center">
              <span className="p4">&#9785;</span>
                <p>
                  По вашему запросу ничего не найдено.
                </p>
                <p>
                  Попробуйте изменить
                <span className="txt-success"onClick={this.handleShowFilters}>
                  фильтры
                </span>.
                </p>


            </div>
            :circlePreloader(300)
          }
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}

render(<IGPublics />, document.getElementById('ig_publics'));

