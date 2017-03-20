import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Sticky from '../../../../components/react-sticky/';

import Dropdown from '../../../../components/advertika/dropdown';
import Btn from '../../../../components/advertika/btnitem';
import Checkbox from '../../../../components/advertika/Checkbox';

import Inputs from '../../../../components/advertika/double-text-input';
import InputItem from '../../../../components/advertika/InputItem.jsx';
import moment from 'moment';
import Datepicker from '../../../../components/advertika/DateRangePicker';


export default React.createClass({
  getInitialState() {
    return AdPostsfilterCfg();
  },

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ AdvFilters: false });
      document.removeEventListener('click', this._outsideClick);
    }
  },

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  },
  resetFilters() {
    this.props.reset();
    this.setState(AdPostsfilterCfg());
  },
  handleShowAdvFilters() {
    this.setState({ AdvFilters: !this.state.AdvFilters });
    document.addEventListener('click', this._outsideClick);
  },
  handleChangeGroupCheckboxes(group, i, name, val) {
    this.state[group][i].checked = val;
    // this.setState(this.state);
    this.props.changeFilter(name, val);
  },
  handleChangeGroupInputs(i, group, name, val) {
    // console.log(name,val)
    this.state[group][i].from = val.from;
    this.state[group][i].to = val.to;
    this.props.changeInputs(null, name, val);
  },
  handleChangeSingleInput(i, name, val) {

    this.state.reposts[i].value = val;
    this.props.changeFilter(name, val);
  },

  render() {

    let firstLineControls = (item, i) => {
      switch (item.control) {
        case 'datepicker':
        return <Datepicker
                ref="datepicker"
                className={cx({ __locked: !window.access })}
                title={item.title}
                startDate={moment(this.props.dateStart, 'DD MM YYYY')}
                endDate={moment(this.props.dateEnd, 'DD MM YYYY')}
                setDate={this.props.setDate}
                opens="left"
                applyDate={this.props.applyFilter}
              />;
        case 'dropdown':
        return <Dropdown
                {...item}
                index={i}
                ref="dropdown"
                items={item}
                onChange={this.props.changeFilter}
                applySelected={this.props.applyFilter}
              />;
        case 'inputs':
        return <Inputs
                {...item}
                ref="inputs"
                parentClass="__title-top __title-bold"
                group="visFilters"
                pressEnter={this.props.applyFilter}
                onChange={this.handleChangeGroupInputs.bind(null,i)}
              />
      }
    };
    return (
        <Sticky
          style={{ position: 'absolute', zIndex: '10' }}
          stickyStyle={{ zIndex: '10', position: 'fixed', top: 0, left: 0, right: 0, minWidth: '1200px' }}
        >
          <div
            className="[ container ] fhp"
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
                <div className="left px1 col-25">
                  <h4 className="center">Вовлеченность:</h4>
                  {this.state.Involvement.map(
                    (c, i) => (
                      <div className="mb1"key={i} >
                        <Inputs
                          {...c}
                          key={c.name}
                          parentClass="__title-top"
                          pressEnter={this.props.applyFilter}
                          onChange={this.handleChangeGroupInputs.bind(null, i)}
                        />
                      </div>
                  ))}
                </div>
                <div className="left px1 col-20">
                  <h4 className="center">Биржи:</h4>
                  {this.state.exchange.map((c, i) => (
                    <div className="mb1" key={i}>
                      <Checkbox
                        {...c}
                        onChange={this.handleChangeGroupCheckboxes.bind(null, 'exchange', i)}
                      />
                    </div>
                  ))}
                  <h4 className="center">Статус поста:</h4>
                  <div className="center mt1">
                    {this.state.status.map((c, i) => (
                      <Checkbox
                        {...c}
                        key={i}
                        onChange={this.handleChangeGroupCheckboxes.bind(null, 'status', i)}
                      />
                    ))}
                  </div>
                </div>
                <div className="left px1 col-25">
                  <h4 className="center">Реклама:</h4>
                  {this.state.ads.map((c, i) => (
                      <div className="mb1"key={c.name} >
                        <Inputs
                          {...c}
                          parentClass="__title-top"
                          pressEnter={this.props.applyFilter}
                          onChange={this.handleChangeGroupInputs.bind(null, i)}
                        />
                      </div>
                    ))}
                </div>
                <div className="left px1 col-30">
                  <h4 className="center">Тип поста:</h4>
                  {this.state.post_type.map((c, i) => (
                      <div
                        className="mb1"
                        key={i}
                        onClick={i === 2 ? () => {setTimeout(() => this.forceUpdate(), 50);} : false}
                      >
                        <Checkbox
                          {...c}
                          onChange={this.handleChangeGroupCheckboxes.bind(null, 'post_type', i)}
                        />
                      </div>
                    ))}
                  {this.state.reposts.map((c, i) => (
                      <div className="mb1" key={i}>
                        {c.title}
                        <InputItem
                          name={c.name}
                          placeholder={c.placeholder}
                          value={c.value}
                          className="field __block"
                          disabled={!this.state.post_type[2].checked}
                          type="text"
                          onChange={this.handleChangeSingleInput.bind(null, i)}
                        />
                      </div>
                  ))}
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
                />
              }
            </div>
          </div>
        </Sticky>
    );
  },
});

