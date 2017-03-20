import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';

import Sticky from '../../../../../components/react-sticky/';
import GeoDropdown from '../../../../../components/advertika/geo-dropdown';
import CheckboxesDropdown from '../../../../../components/advertika/checkboxes-dropdown';
import Btn from '../../../../../components/advertika/btnitem';
import Checkbox from '../../../../../components/advertika/CheckboxV2';
import Inputs from '../../../../../components/advertika/double-text-inputV2';
import InputItem from '../../../../../components/advertika/InputItemV2.jsx';


import * as actions from '../actions';

const mapStateToProps = ({ tableConfig, filterConfig, tableData, filterView }) => ({
  tableConfig,
  filterView,
  filterConfig,
  tableData,
});

@connect(mapStateToProps, actions)
export default class Filters extends Component {
  static propTypes = {
    reset: PropTypes.func,
    applyFilter: PropTypes.func,
    resetFilter: PropTypes.func,
    changeFilter: PropTypes.func,
    fetchTableData: PropTypes.func,
    filterConfig: PropTypes.object,
    filterView: PropTypes.object,

  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      AdvFilters: false,
    };
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ AdvFilters: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleShowAdvFilters() {
    this.setState({ AdvFilters: !this.state.AdvFilters });
    document.addEventListener('click', this._outsideClick);
  }

  applyFilter() {
    this.props.fetchTableData(this.props.filterConfig);
  }

  applyAdvFilter() {
    this.setState({
      AdvFilters: false,
    });
    this.props.fetchTableData(this.props.filterConfig);
  }

  render() {
    const { filterView, changeFilter, filterConfig, resetFilter, applyFilter } = this.props;

    const CheckboxesColumn = columns => (
      <div className="left px1 col_half">
        {columns.map((column, i) => (
          <div className="left px1 col_half" key={i}>
            {column.map((item, j) => (
              <div className="mb1" key={item.name}>
                <Checkbox
                  children={item.children}
                  name={item.name}
                  checked={filterConfig[item.name]}
                  onChange={event => changeFilter({ [item.name]: event.target.checked })}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    return (
      <Sticky
        style={{ position: 'absolute', zIndex: 10 }}
        stickyStyle={{ zIndex: 202, position: 'fixed', top: 0, left: 0, right: 0, minWidth: '1200px' }}
      >
        <div className={cx('[ container ] fhp', { __locked: !window.access })} style={{ paddingBottom: '0px' }}>
          <div className="fhp_resetfilters" onClick={resetFilter}>
            Очистить фильтры <i className="ion-close-circled"></i>
          </div>


          <div className="clearfix mb1 fhp_controls">

            <GeoDropdown
              {...filterView.geo}
              wrapClass="left col-25"
              checkedItems={filterConfig.country || []}
              onChange={(key, val) => changeFilter({ [key]: val })}
              applySelected={applyFilter}
            />
            <div className="left col-25">
              <Inputs
                btn
                name="subscribers"
                title="Подписчиков:"
                parentClass="__title-top __title-bold"
                from={filterConfig.subscribers && filterConfig.subscribers.from || ''}
                to={filterConfig.subscribers && filterConfig.subscribers.to || ''}
                pressEnter={applyFilter}
                onChange={(key, val) => changeFilter({ [key]: val })}
              />
            </div>
            <div className="left col-25">
              <CheckboxesDropdown
                {...filterView.category}
                checkedItems={filterConfig.category || []}
                onChange={(key, val) => changeFilter({ [key]: val })}
                applySelected={applyFilter}
              />
            </div>
            <div className="left col-25">
              <Inputs
                btn
                name="price"
                title="Цена поста:"
                parentClass="__title-top __title-bold"
                from={filterConfig.price && filterConfig.price.from || ''}
                to={filterConfig.price && filterConfig.price.to || ''}
                pressEnter={applyFilter}
                onChange={(key, val) => changeFilter({ [key]: val })}
              />
            </div>

          </div>

          {!!this.state.AdvFilters &&

          <div
            className={`clearfix py1 border-top fhp_adv ${this.state.AdvFilters ? '__show' : ''}`}
            style={{ background: '#fff' }}
          >
            <div className="clearfix">

              <div className="left px1 col_fourth">
                <h4>По городам:</h4>
                <InputItem
                  value={filterConfig.cities || ''}
                  className="field __block mb1"
                  placeholder="Введите города через запятую"
                  type="textarea"
                  rows="3"
                  onChange={e => changeFilter({ cities: e.target.value })}
                />
                <h4>Охват и вовлеченность:</h4>
                {filterView.cov_and_inv.map(item => (
                  <Inputs
                    {...item}
                    key={item.name}
                    pressEnter={applyFilter}
                    from={filterConfig[item.name] && filterConfig[item.name].from || ''}
                    to={filterConfig[item.name] && filterConfig[item.name].to || ''}
                    onChange={(key, val) => changeFilter({ [key]: val })}
                    style={{ letterSpacing: '-1px' }}
                  />
                ))}

              </div>
              <div className="left col_half px1">

                <div className="clearfix">
                  <div className="left px1 col_half">
                    <div className="mb1">
                      <Inputs
                        name="percent_man"
                        title="% Мужчин:"
                        plfrom="%, от"
                        plto="%, до"
                        parentClass="__title-top __title-bold"
                        pressEnter={applyFilter}
                        from={filterConfig.percent_man && filterConfig.percent_man.from || ''}
                        to={filterConfig.percent_man && filterConfig.percent_man.to || ''}
                        onChange={(key, val) => changeFilter({ [key]: val })}
                      />
                    </div>
                  </div>
                  <div className="left px1 col_half ">
                    <div className="mb1">
                      <Inputs
                        name="percent_woman"
                        title="% Женщин:"
                        plfrom="%, от"
                        plto="%, до"
                        parentClass="__title-top __title-bold"
                        pressEnter={applyFilter}
                        from={filterConfig.percent_woman && filterConfig.percent_woman.from || ''}
                        to={filterConfig.percent_woman && filterConfig.percent_woman.to || ''}
                        onChange={(key, val) => changeFilter({ [key]: val })}
                      />
                    </div>
                  </div>
                </div>
                <h4 className="center">Преобладающий возраст</h4>
                <div className="clearfix mxn1 py1">
                  {CheckboxesColumn(filterView.manrange)}
                  {CheckboxesColumn(filterView.womanrange)}

                </div>
              </div>
              <div className="left px1 col_fourth">
                <div className="mb1">
                  <Inputs
                    name="cpm"
                    title="CPM:"
                    parentClass="__title-top __title-bold"
                    pressEnter={applyFilter}
                    from={filterConfig.cpm && filterConfig.cpm.from || ''}
                    to={filterConfig.cpm && filterConfig.cpm.to || ''}
                    onChange={(key, val) => changeFilter({ [key]: val })}
                  />
                </div>
                <h4>Биржи:</h4>
                {filterView.exchange.map(item => (
                  <div className="mb1" key={item.name}>
                    <Checkbox
                      children={item.children}
                      name={item.name}
                      checked={filterConfig[item.name]}
                      onChange={event => changeFilter({ [item.name]: event.target.checked })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px1 clearfix">
              <div className="left px1 col_third">
                <h4>Устройства:</h4>
                <div className="mb1">
                  <span className="size-32 mr1">
                    <i className="ion-monitor" />
                  </span>
                  <InputItem
                    placeholder="%, от"
                    className="field __sm mr2"
                    type="text"
                    value={filterConfig.desktop}
                    onChange={e => changeFilter({ desktop: e.target.value.replace(/[^0-9.,]+/ig, '') })}
                  />
                  <span className="size-32 mr1">
                    <i className="ion-iphone" />
                  </span>
                  <InputItem
                    placeholder="%, от"
                    className="field __sm"
                    type="text"
                    name="mobile"
                    value={filterConfig.mobile}
                    onChange={e => changeFilter({ mobile: e.target.value.replace(/[^0-9.,]+/ig, '') })}
                  />
                </div>
              </div>
              <div className="left px1 py2 col_third center">
                  <strong>
                    Ботов до:
                  </strong>
                  {' '}
                  <InputItem
                    name="bots"
                    placeholder="%"
                    className="field __sm"
                    type="text"
                    value={filterConfig.bots}
                    onChange={e => changeFilter({ bots: e.target.value.replace(/[^0-9.,]+/ig, '') })}
                  />
              </div>
              <div className="left px1 py3 col_third a-right">
                <Checkbox
                  name="open_statistics"
                  checked={filterConfig.open_statistics}
                  onChange={event => changeFilter({ open_statistics: event.target.checked })}
                >
                  Только с открытой статистикой
                </Checkbox>
              </div>
            </div>
          </div>}
          <div className="center border-top clearfix" style={{ padding: 3 }}>
            <Btn
              className="__primary __xs right"
              children={this.state.AdvFilters ? 'Скрыть' : '+ Фильтры'}
              onClick={this.handleShowAdvFilters}
            />
            {!!this.state.AdvFilters &&
              <Btn
                className="__primary __xs"
                children="Применить фильтры"
                onClick={this.applyAdvFilter}
              />}
          </div>
        </div>
      </Sticky>
    );
  }
}
