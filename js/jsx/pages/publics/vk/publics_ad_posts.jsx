import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import cx from 'classnames';
import _ from 'underscore';
import Btn from '../../../components/advertika/btnitem';
import { numberWithSpaces } from '../../../components/advertika/helpers';
import ReactTooltip from '../../../components/react-tooltip/react-tooltip';
import Dropdown from '../../../components/advertika/dropdown';
import Searchform from '../../../components/advertika/searchform';
import Post from '../../../components/advertika/post_vk_tpl';
import Filters from './ad_posts/filters';
import FreemiumMessage from './ad_posts/freemium_message';



const AdPosts = React.createClass({

  getDefaultProps() {
    return AdPostsProps();
  },

  getInitialState() {
    return AdPostsState();
  },

  componentWillMount() {
    if (location.search.length) {
      const search = location.search.substring(1);
      let cfg = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

      Object.keys(cfg).forEach(
        c => {
          if (/\[/.test(c)){
            if (!cfg[c.replace(/\[.*/, '')])cfg[c.replace(/\[.*/, '')] = {};
            cfg[c.replace(/\[.*/, '')][c.match(/\[(.*)\]/).pop()] = cfg[c];
            delete cfg[c];
          }
        }
      );
      if (cfg.inputField) {
        cfg.inputField = decodeURIComponent(cfg.inputField);
      }
      this.state.cfg = { ...this.state.cfg, ...cfg };

    }

    this.applyFilter();

  },

  resetFilters() {
    this.state.cfg.dateStart = moment().subtract(29, 'days').format('DD.MM.YYYY');
    this.state.cfg.dateEnd = moment().format('DD.MM.YYYY');
    delete this.state.cfg.country;
    setTimeout(() => this.applyFilter(), 100);
  },

  changeFilter(key, val) {
    if (val) {
      this.state.cfg[key] = val;
    } else {
      delete this.state.cfg[key];
    }
  },

  changeInputs(group, key, val) {
    if (!val.from && !val.to) {
      delete this.state.cfg[key];
    } else {
      this.state.cfg[key] = val;
    }
  },

  setDate(start, end) {
    this.state.cfg.dateStart = start;
    this.state.cfg.dateEnd = end;
    this.forceUpdate();
  },

  applyFilter() {
    this.state.cfg.page = 0;
    this.setState({ loading: true });
    $.getJSON(this.props.url, this.state.cfg, result => {
    this.state.items  = result.items;
    this.state.totalCount = result.totalCount;
    this.state.cfg.page ++;
      if (this.isMounted()) {
        this.setState({
          totalCount: result.totalCount,
          loading: false,
          page: 1,
        });
      }
    });
  },

  loadNext() {
    this.setState({ loading: true });
    $.getJSON(this.props.url, _.extend(this.state.cfg, { loadnext: true }), result => {
      this.state.items = this.state.items.concat(result.items);
      this.state.totalCount = result.totalCount;
      this.state.cfg.page ++;
      this.setState({
        loading: false,
      });
    });
  },

  render() {
    return (
      <div>
      {this.state.loading
        ? <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
          <div className="indeterminate"></div>
        </div>
        : null}
        <div className="row">
          <Searchform
            ref="Searchform"
            classNames="left col-60 offset-20 mb2"
            name="inputField"
            placeholder="Введите текст из поста, название сообщества или рекламную ссылку"
            onChange={this.changeFilter}
            onSubmit={this.applyFilter}
            rewritable={true}
            value={this.state.cfg.inputField}
            />
          <div className={cx('left col-20', { __locked: !window.access })}>
            <Dropdown
              {...this.props.sort}
              ref="dropdown"
              items={this.props.sort}
              onChange={this.changeFilter}
              applySelected={this.applyFilter}
            />
          </div>
        </div>
        <Filters
          {...this.state.cfg}
          setDate={this.setDate}
          reset={this.resetFilters}
          changeFilter={this.changeFilter}
          applyFilter={this.applyFilter}
          changeInputs={this.changeInputs}
        />


        {(this.state.items && this.state.items.length) &&
          <div style={{ paddingTop: 145 }}>

          {!window.access &&
            <FreemiumMessage
              datacount={numberWithSpaces(this.state.totalCount)}
              dataLength={this.state.items.length}
            />}

            <div className="clearfix mxn1">

              {this.state.items.map( // Вывод постов/репостов
                (postData, i) => <div className="inline-block align-top col_half px1" key={i}>
                    <Post {...postData} header="true" />
                  </div>
              )}

            </div>

            <div className={cx('center mb4', { __locked: !window.access })}>
              {(this.state.items.length != this.state.totalCount) && // Блок с кнопкой "Загрузить еще"
                <Btn
                  className="__primary"
                  onClick={ this.loadNext.bind(null, this.state.cfg) }
                  disabled={ this.state.loading }
                >
                  {!this.state.loading ? 'Загрузить еще' : 'Загрузка'}
                </Btn>
              }

              <div>
                <small>{`Отображается ${this.state.items.length} из ${this.state.totalCount}`}</small>
              </div>
            </div>
          </div> }
          {
          (!this.state.loading && !this.state.items.length) &&
          <div className="py4 center" style={{ marginTop: '90px' }}>
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
  },
});


ReactDOM.render(<AdPosts />, document.getElementById('vk-posts'));
