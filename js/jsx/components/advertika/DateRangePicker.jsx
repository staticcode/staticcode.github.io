'use strict'

import React from 'react';
import moment from 'moment';
import DateRangePicker from '../react-daterangepicker/lib/index';

const DatePicker = React.createClass({
  getInitialState() {
    return {
      locale: {
        format: 'DD.MM.YYYY',
        // "separator": " - ",
        // "applyLabel": "Apply",
        // "cancelLabel": "Cancel",
        // "fromLabel": "From",
        // "toLabel": "To",
        customRangeLabel: 'Выбрать диапазон',
        daysOfWeek: [
          'Пн',
          'Вт',
          'Ср',
          'Чт',
          'Пт',
          'Сб',
          'Вс',
        ],
        monthNames: [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ],
        firstDay: 1,
      },
      ranges: {
        'Сегодня': [moment(), moment()],
        'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Неделя': [moment().subtract(6, 'days'), moment()],
        'Месяц': [moment().subtract(1, 'month'), moment()],
        'Квартал': [moment().subtract(3, 'month'), moment()],
        'Год': [moment().subtract(1, 'year'), moment()],
        'Весь период': [moment(this.props.allRange || '01.01.2015', 'DD MM YYYY'), moment()],
      },
      'linkedCalendars': false,
      alwaysShowCalendars: true,
      startDate: this.props.startDate || moment().subtract(1, 'month'),
      endDate: this.props.endDate || moment(),
      maxDate: this.props.maxDate || moment(),
      minDate: this.props.minDate || false,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.startDate && this.props.endDate) {

      this.setState({
        startDate: nextProps.startDate,
        endDate: nextProps.endDate,
      });
    }
  },

  reset() {
    this.setState({
      startDate: moment().subtract(1, 'month'),
      endDate: moment(),
    });
  },

  handleHide(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
    this.props.setDate(
      moment(picker.startDate).format('DD.MM.YYYY'),
      moment(picker.endDate).format('DD.MM.YYYY')
    );
  },
  handleApply(event, picker) {
    // this.handleHide(event, picker);
    this.props.applyDate();
  },
  render() {
    var start = this.state.startDate.format('DD.MM.YYYY');
    var end = this.state.endDate.format('DD.MM.YYYY');
    var label = start + ' - ' + end;
    if (start === end) {
      label = start;
    }
    return (

      <div className={this.props.className}>
        {!!this.props.title &&
          <div
            className="fhp_title"
            style={{ marginBottom: 5, fontWeight: 'bold' }}
          >
            {this.props.title}
          </div>}

        <div className={'pseudo-select' + (this.state.open ? ' __open' : '')}>
          <DateRangePicker
            maxDate={this.state.maxDate}
            minDate={this.state.minDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            ranges={this.props.ranges || this.state.ranges}
            onApply={this.handleApply}
            onHide={this.handleHide}
            opens={this.props.opens}
            locale={this.state.locale}
          >
            <div className="pseudo-select_title" >
              {label}
            </div>
          </DateRangePicker>
        </div>
      </div>

    );
  },
});

export default DatePicker;
