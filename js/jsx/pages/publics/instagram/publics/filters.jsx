import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import Dropdown from '../../../../components/advertika/dropdown';
import Btn from '../../../../components/advertika/btnitem';
import Checkbox from '../../../../components/advertika/Checkbox';
import RadioButton from '../../../../components/advertika/Radio_button';
import Inputs from '../../../../components/advertika/double-text-input';
import _ from 'underscore';

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = window.filterState();

    this._outsideClick = this._outsideClick.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.handleFollowed = this.handleFollowed.bind(this);
    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeRadiobuttons = this.handleChangeRadiobuttons.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  setDate(start, end) {
    this.props.changeFilter('date', { start, end });
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ showFilters: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleResetFilters() {
    this.refs.geo.handleChange(() => false);
    this.refs.doubleInput.handleReset();
    const newState = window.filterState();
    newState.showFilters = this.state.showFilters;
    this.setState(newState);
    setTimeout(
      () => this.props.applyFilter(),
      100
    );
  }

  handleShowFilters() {
    this.setState({ showFilters: !this.state.showFilters });
    document.addEventListener('click', this._outsideClick);
  }

  handleFollowed(a, name, val) {
    _.extend(this.state.TxtInputs.followed, val);
    this.props.setDetailFilterProp(name, val);
  }

  handleChangeTextInput(group, name, val) {
    this.props.setDetailFilterProp(name, val);
    this.state.TxtInputs[group].forEach(c => {
      if (c.name == name) {
        c.from = val.from;
        c.to = val.to;
      }
    });
  }

  handleChangeCheckbox(key, val) {
    this.state.Checkboxes[key] = val;
    this.props.setDetailFilterProp(key, val);
  }

  handleChangeRadiobuttons(name, index) {
    this.props.setDetailFilterProp(name, index);
    this.state.Radiobuttons.forEach((c, i) => {
      c.checked = i == index;
    });
  }

  handleApplyFilter() {
    this.props.applyFilter();
    this.setState({ showFilters: false });
    document.removeEventListener('click', this._outsideClick);
  }

  render() {
    return (
      <div className={`[ col-65 mx-auto mb2 ] ${this.props.className}`}>
        <div className="row">
          <div className="left col-35">
            <Dropdown
              {...geoDD}
              items={geoDD}
              ref="geo"
              onChange={this.props.changeFilter}
              applySelected={this.handleApplyFilter}
            />
          </div>
          <div className="left col-35">
            <Inputs
              ref="doubleInput"
              {...this.state.TxtInputs.followed}
              parentClass="__title-top __title-bold"
              btn={true}
              pressEnter={this.handleApplyFilter}
              onChange={this.handleFollowed}
            />
          </div>
          <div className="left col-30">
            <span
              className="piblics-ig_reset-filters"
              onClick={this.handleResetFilters}
            >
              Сбросить фильтры
            </span>
            <Btn
              className={`__success __block __lg ${this.state.showFilters ? '__outline' : ''}`}
              onClick={ this.handleShowFilters }
            >
              {this.state.showFilters ? 'Свернуть' : '+ Фильтры'}
            </Btn>

          </div>
        </div>
        <div className={`public-ig_hidden-filters ${this.state.showFilters ? '__show' : ''}`} ref="hf">
          <div className="public-ig_filters-column">
            <h4>Аудитория</h4>
            {this.state.TxtInputs.Audience.map(c => (
              <Inputs
                {...c}
                key={c.name}
                group="Audience"
                pressEnter={this.handleApplyFilter}
                onChange={this.handleChangeTextInput}
              />
              ))}
          </div>
          <div className="public-ig_filters-column">
            <h4>Вовлеченность</h4>
            {this.state.TxtInputs.Involvement1.map(c => (
              <Inputs
                {...c}
                key={c.name}
                group="Involvement1"
                pressEnter={this.handleApplyFilter}
                onChange={this.handleChangeTextInput}
              />
              ))}
            <div className="public-ig_radio-group mb1">
               <RadioButton list={this.state.Radiobuttons} onChange={this.handleChangeRadiobuttons} />
            </div>
            {this.state.TxtInputs.Involvement2.map(c => (
              <Inputs
                {...c}
                key={c.name}
                group="Involvement2"
                pressEnter={this.handleApplyFilter}
                onChange={this.handleChangeTextInput}
              />
              ))}
          </div>
          <div className="public-ig_filters-column">
            <h4>Реклама</h4>

             <div className="mb1">
               <Checkbox
                 name="in_exchange"
                 checked={this.state.Checkboxes.in_exchange}
                 onChange={this.handleChangeCheckbox}
               >
                 Есть на бирже
               </Checkbox>
             </div>
            {this.state.TxtInputs.advertising.map(c => (
              <Inputs
                {...c}
                key={c.name}
                group="advertising"
                pressEnter={this.handleApplyFilter}
                onChange={this.handleChangeTextInput}
              />
              ))}

          </div>
          <div className="center">
            <Btn className="__primary __sm" onClick={this.handleApplyFilter}>Применить и найти</Btn>
          </div>

        </div>


      </div>
    );
  }
}

Filters.propTypes = {
  className: PropTypes.string,
  changeFilter: PropTypes.func,
  applyFilter: PropTypes.func,
  setDetailFilterProp: PropTypes.func,
};


export default Filters;
