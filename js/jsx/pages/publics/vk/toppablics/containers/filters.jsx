import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import Sticky from '../../../../../components/react-sticky/';
import Dropdown from '../../../../../components/advertika/dropdown';
import Btn from '../../../../../components/advertika/btnitem';
import Checkbox from '../../../../../components/advertika/Checkbox';
import Inputs from '../../../../../components/advertika/double-text-input';
import InputItem from '../../../../../components/advertika/InputItem.jsx';


class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = window.filterCfgToppablics();

    this._outsideClick = this._outsideClick.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleShowAdvFilters = this.handleShowAdvFilters.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleChangeGroupColumnCheckboxes = this.handleChangeGroupColumnCheckboxes.bind(this);
    this.handleChangeGroupCheckboxes = this.handleChangeGroupCheckboxes.bind(this);
    this.handleChangeSingleInput = this.handleChangeSingleInput.bind(this);
    this.handleChangeGroupInputs = this.handleChangeGroupInputs.bind(this);
    this.handleChangeDoubleInput = this.handleChangeDoubleInput.bind(this);
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

  resetFilters() {
    this.props.reset();
    this.setState(window.filterCfgToppablics());
    setTimeout(() => this.props.applyFilter(), 100);
  }

  handleShowAdvFilters() {
    this.setState({ AdvFilters: !this.state.AdvFilters });
    document.addEventListener('click', this._outsideClick);
  }

  changeFilter(name, val) {
    this.props.changeFilter(name, val);
  }

  handleChangeGroupColumnCheckboxes(group, i, j, name, val) {
    this.state[group][i][j].checked = val;
    this.props.changeFilter(name, val);
  }

  handleChangeGroupCheckboxes(group, i, name, val) {
    this.state[group][i].checked = val;
    this.props.changeFilter(name, val);
  }

  handleChangeSingleInput(name, val) {
    this.state[name] = { value: val };
    this.props.changeFilter(name, val);
  }

  handleChangeGroupInputs(i, group, name, val) {
    this.state[group][i].from = val.from;
    this.state[group][i].to = val.to;
    this.props.changeInputs(null, name, val);
  }

  handleChangeDoubleInput(group, name, val) {
    this.state[name] = val;
    this.props.changeInputs(null, name, val);
  }

  render() {
    const firstLineControls = (item, i) => {
      switch (item.control) {
        case 'dropdown':
          return (
            <Dropdown
              {...item}
              index={i}
              ref={item.filterName}
              items={item}
              inputType={item.inputType}
              filterName={item.filterName}
              title={item.title}
              subtitle={item.subtitle}
              onChange={this.props.changeFilter}
              applySelected={this.props.applyFilter}
            />);
        case 'inputs':
          return (
            <Inputs
              {...item}
              ref="inputs"
              group="visFilters"
              parentClass="__title-top __title-bold"
              pressEnter={this.props.applyFilter}
              onChange={this.handleChangeGroupInputs.bind(null, i)}
            />);
      }
    };
    return (
        <Sticky
          style={{ position: 'absolute', zIndex: 10 }}
          stickyStyle={{ zIndex: 10, position: 'fixed', top: 0, left: 0, right: 0, minWidth: '1200px' }}
        >
          <div
            className={cx('[ container ] fhp', { __locked: !window.access })}
            style={{ paddingBottom: '0px' }}
          >
            <div className="fhp_resetfilters" onClick={this.resetFilters}>
              Очистить фильтры <i className="ion-close-circled"></i>
            </div>


            <div className="clearfix mb1 fhp_controls">
              {this.state.visFilters.map((item, i) => (
                <div className="left px1" style={{ width: `${100 / this.state.visFilters.length}%` }} key={i}>
                  {firstLineControls(item, i)}
                </div>
              ))}
            </div>
            <div
              className={`clearfix py1 border-top fhp_adv ${this.state.AdvFilters ? '__show' : ''}`}
              style={{ background: '#fff' }}
            >
              <div className="clearfix">

                <div className="left px1 col_fourth">
                  <h4>По городам:</h4>
                  <InputItem
                    {...this.state.cities}
                    name="cities"
                    className="field __block mb1"
                    placeholder="Введите города через запятую"
                    type="textarea"
                    rows="3"
                    onChange={this.handleChangeSingleInput}
                  />
                  <h4>Охват и вовлеченность:</h4>
                  {this.state.cov_and_inv.map((c, i) => (
                    <Inputs
                      {...c}
                      key={c.name}
                      pressEnter={this.props.applyFilter}
                      onChange={this.handleChangeGroupInputs.bind(null, i)}
                      style={{ letterSpacing: '-1px' }}
                    />
                  ))}

                </div>
                <div className="left col_half px1">

                  <div className="clearfix">
                    <div className="left px1 col_half">
                      <div className="mb1">
                        <Inputs
                          {...this.state.percent_man}
                          name="percent_man"
                          title="% Мужчин:"
                          plfrom="%, от"
                          plto="%, до"
                          parentClass="__title-top __title-bold"
                          pressEnter={this.props.applyFilter}
                          onChange={this.handleChangeDoubleInput}
                        />
                      </div>
                    </div>
                    <div className="left px1 col_half ">
                      <div className="mb1">
                        <Inputs
                          {...this.state.percent_woman}
                          name="percent_woman"
                          title="% Женщин:"
                          plfrom="%, от"
                          plto="%, до"
                          parentClass="__title-top __title-bold"
                          pressEnter={this.props.applyFilter}
                          onChange={this.handleChangeDoubleInput}
                        />
                      </div>
                    </div>
                  </div>
                  <h4 className="center">Преобладающий возраст</h4>
                  <div className="clearfix mxn1 py1">
                    <div className="left px1 col_half">
                      {this.state.manrange.map((c, i) => (
                        <div className="left px1 col_half" key={i}>
                          {c.map((c, j) => (
                            <div className="mb1" key={c.name}>
                              <Checkbox
                                {...c}
                                onChange={this.handleChangeGroupColumnCheckboxes.bind(null, 'manrange', i, j)}
                              />
                            </div>
                          ))}
                        </div>
                      ))}

                    </div>
                    <div className="left px1 col_half border-left">
                      {this.state.womanrange.map((c, i) => (
                        <div className="left px1 col_half" key={i}>
                          {c.map((c, j) => (
                            <div className="mb1" key={c.name}>
                              <Checkbox
                                {...c}
                                onChange={this.handleChangeGroupColumnCheckboxes.bind(null, 'womanrange', i, j)}
                              />
                            </div>
                          ))}
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
                <div className="left px1 col_fourth">
                  <div className="mb1">
                    <Inputs
                      {...this.state.cpm}
                      name="cpm"
                      title="CPM:"
                      parentClass="__title-top __title-bold"
                      pressEnter={this.props.applyFilter}
                      onChange={this.handleChangeDoubleInput}
                    />
                  </div>
                  <h4>Биржи:</h4>
                  {this.state.exchange.map((c, i) => (
                    <div className="mb1" key={c.name}>
                      <Checkbox
                        {...c}
                        onChange={this.handleChangeGroupCheckboxes.bind(null, 'exchange', i)}
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
                      {...this.state.desktop}
                      validate="numbers"
                      placeholder="%, от"
                      className="field __sm mr2"
                      type="text"
                      name="desktop"
                      onChange={this.handleChangeSingleInput}
                    />
                    <span className="size-32 mr1">
                      <i className="ion-iphone" />
                    </span>
                    <InputItem
                      {...this.state.mobile}
                      validate="numbers"
                      placeholder="%, от"
                      className="field __sm"
                      type="text"
                      name="mobile"
                      onChange={this.handleChangeSingleInput}
                    />
                  </div>
                </div>
                <div className="left px1 py2 col_third center">
                    <strong>
                      Ботов до:
                    </strong>
                    {' '}
                    <InputItem
                      {...this.state.bots}
                      validate="numbers"
                      name="bots"
                      placeholder="%"
                      className="field __sm"
                      type="text"
                      onChange={this.handleChangeSingleInput}
                    />
                </div>
                <div className="left px1 py3 col_third a-right">
                  <Checkbox
                    {...this.state.open_statistics}
                    name="open_statistics"
                    onChange={
                      (key, val) => {
                        this.props.changeFilter(key, val);
                        this.state.open_statistics.checked = val;
                      }
                    }
                  >
                    Только с открытой статистикой
                  </Checkbox>
                </div>
              </div>
            </div>
            <div
              className="center border-top clearfix"
              style={{ padding: 3 }}
            >
              <Btn
                className="__primary __xs right"
                children={this.state.AdvFilters ? 'Скрыть' : '+ Фильтры'}
                onClick={this.handleShowAdvFilters}
              />
              {!!this.state.AdvFilters &&
                <Btn
                  className="__primary __xs"
                  children="Применить фильтры"
                  onClick={this.props.applyFilter}
                />}
            </div>
          </div>
        </Sticky>
    );
  }
}

Filters.propTypes = {
  reset: PropTypes.func,
  applyFilter: PropTypes.func,
  changeFilter: PropTypes.func,
  changeInputs: PropTypes.func,
};


export default Filters;





