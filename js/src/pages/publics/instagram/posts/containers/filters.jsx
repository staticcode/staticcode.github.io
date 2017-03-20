import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import cx from 'classnames';
import { connect } from 'react-redux';
import Datepicker from '../../../../../components/advertika/DateRangePicker';
import Dropdown from '../../../../../components/advertika/dropdown';
import GeoDropdown from '../../../../../components/advertika/geo-dropdown';
import Btn from '../../../../../components/advertika/btnitem';
import Checkbox from '../../../../../components/advertika/CheckboxV2';
import Inputs from '../../../../../components/advertika/double-text-inputV2';
import * as actions from '../actions/';

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = window.filterState();

    this._outsideClick = this._outsideClick.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.toggleGeoDropdown = this.toggleGeoDropdown.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  setDate(start, end) {
    this.props.changeFilter({ ['date']: { start, end } });
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ showFilters: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleShowFilters() {
    this.setState({ showFilters: !this.state.showFilters });
    document.addEventListener('click', this._outsideClick);
  }

  handleResetFilters() {
    this.props.resetFilter();
    setTimeout(() => this.props.applyFilter(), 100);
  }

  toggleGeoDropdown(key, val) {
    this.props.changeFilter({ [key]: val });
  }

  handleChangeTextInput(key, val) {
    this.props.changeFilter({ [key]: val });
  }

  handleChangeCheckbox(key, event) {
    const { checked } = event.target;
    this.props.changeFilter({ [key]: checked });
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
            <GeoDropdown
              {...window.geoDropdown}
              checkedItems={this.props.filter.geo_id}
              onChange={this.toggleGeoDropdown}
              applySelected={this.handleApplyFilter}

            />
          </div>
          <div className={cx('left col-35', { __locked: !window.access })}>
            <Datepicker
              title="Период:"
              ref="datepicker"
              startDate={moment(this.props.filter.date.start, 'DD MM YYYY')}
              endDate={moment(this.props.filter.date.end, 'DD MM YYYY')}
              setDate={window.access && this.setDate}
              opens="center"
              applyDate={window.access && this.handleApplyFilter}
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
            <h4>Вовлеченность</h4>
            {this.state.TxtInputs.Involvement.map(c => (
              <Inputs
                {...this.props.filter[c.name]}
                key={c.name}
                name={c.name}
                title={c.title}
                pressEnter={this.handleApplyFilter}
                onChange={this.handleChangeTextInput}
              />
            ))}
          </div>

          <div className="public-ig_filters-column">
            <div className="clearfix mb1">
               <div className="left col_half">
               <h4>Содержание</h4>
                <Checkbox
                  design="ion"
                  ionClass="ion-image __success __outline"

                  name="contents_img"
                  checked={this.props.filter.contents_img}
                  onChange={this.handleChangeCheckbox.bind(null, 'contents_img')}
                />
                {' '}
                <Checkbox
                  design="ion"
                  ionClass="ion-ios7-videocam __success __outline"

                  name="contents_video"
                  checked={this.props.filter.contents_video}
                  onChange={this.handleChangeCheckbox.bind(null, 'contents_video')}
                />
               </div>
               <div className="left col_half">
                <h4>Статус</h4>
                <Checkbox
                  design="ion"
                  ionClass="ion-social-instagram-outline __success __outline"
                  name="is_active"
                  checked={this.props.filter.is_active}
                  onChange={this.handleChangeCheckbox.bind(null, 'is_active')}
                />
                {' '}
                <Checkbox
                  design="ion"
                  ionClass="ion-trash-b __success __outline"
                  name="is_deleted"
                  checked={this.props.filter.is_deleted}
                  onChange={this.handleChangeCheckbox.bind(null, 'is_deleted')}
                />

               </div>
             </div>
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
  ChangeFilter: PropTypes.func,
  changeFilter: PropTypes.func,
  applyFilter: PropTypes.func,
  filter: PropTypes.object,

};


function mapStateToProps(state) {
  return {
    filter: state.filter,
  };
}

export default connect(mapStateToProps, actions)(Filters);

