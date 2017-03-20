import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Checkbox from '../../../../components/advertika/CheckboxV2';
import FilterSection from './filter_section';
import Datepicker from '../../../../components/advertika/DateRangePicker';
import InputItem from '../../../../components/advertika/InputItemV2';

const access = window.access;

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.changeDate = this.changeDate.bind(this);
    // this.changePage = this.changePage.bind(this);
    this.changeCheckbox = this.changeCheckbox.bind(this);
    this.changeDimentionRadio = this.changeDimentionRadio.bind(this);
    this.changeDimentionInputs = this.changeDimentionInputs.bind(this);
    this.changeCheckboxes = this.changeCheckboxes.bind(this);
    this.showApplyButton = this.showApplyButton.bind(this);
    this.changeDropdown = this.changeDropdown.bind(this);
    this.changeInputs = this.changeInputs.bind(this);
    // this.getCountProps = this.getCountProps.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetCurrentFilter = this.resetCurrentFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
  }

  componentDidMount() {
    let locationCfg = {};
    if (location.search.length) {
      const search = location.search.substring(1);
      locationCfg = JSON.parse(
        `{"${decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      );
      Object.keys(locationCfg).forEach(c => {
        if (/\[/.test(c)) {
          if (!locationCfg[c.replace(/\[.*/, '')]) {
            locationCfg[c.replace(/\[.*/, '')] = {};
          }

          locationCfg[c.replace(/\[.*/, '')][c.match(/\[(.*)\]/).pop()] = locationCfg[c];

          delete locationCfg[c];
        }
      });
    }
    this.props.changeFilter(locationCfg);
    this.props.fetchData({ ...this.props.filterConfig, ...locationCfg });
  }

  componentDidUpdate() {
    if ((this.props.filterConfig.geo && !this.props.filterConfig.geo.length) && this.props.filterConfig.exactGeo) {
      // uncheck точного совпадения если не чекнута ни одна страна
      this.props.changeFilter({ exactGeo: false });
    }
  }

  changeDate(from, to) {
    this.props.changeFilter({ date: { from, to } });
  }

  applyFilter() {
    this.props.fetchData(this.props.filterConfig);
  }

  showApplyButton(event) {
    const { parentNode } = event.target;
    this.props.toggleVisibility({
      applyButtonVisibility: true,
      applyButtonOffsetTop: `${parentNode.offsetTop + (parentNode.offsetHeight / 2)}px`,
    });
  }

  changeCheckbox(name, event) {
    const { checked } = event.target;
    this.props.changeFilter({ [name]: checked });
    this.showApplyButton(event);
  }

  changeDimentionRadio(name, id, event) {
    delete this.props.filterConfig.iw;
    delete this.props.filterConfig.ih;
    this.props.changeFilter({ [name]: id });
    this.showApplyButton(event);
  }

  changeCheckboxes(name, id, event) {
    const { checked } = event.target;
    this.props.changeFilter({
      [name]: checked
      ? [...this.props.filterConfig[name], id]
      : this.props.filterConfig[name].filter(itemId => itemId !== id) });
    this.showApplyButton(event);
  }

  changeDimentionInputs(name, event) {
    delete this.props.filterConfig.dimention;
    const { value } = event.target;
    this.props.changeFilter({ [name]: value.replace(/[^0-9.,]+/ig, '') });
    this.showApplyButton(event);
  }

  validateTo(name, key) {
    const { filterConfig } = this.props;
    if (filterConfig[name][key] === '') {
      this.props.changeFilter({
        [name]: {
          ...this.props.filterConfig[name],
          [key]: window.filterConfig()[name][key],
        },
      });
    }
    if (+filterConfig[name].from > +filterConfig[name].to) {
      this.props.changeFilter({ [name]: { ...filterConfig[name], to: +filterConfig[name].from } });
    }
  }

  changeInputs(name, key, event) {
    const { value } = event.target;
    this.props.changeFilter({
      [name]: {
        ...this.props.filterConfig[name],
        [key]: value.replace(/[^0-9.,]+/ig, ''),
      },
    });
    this.showApplyButton(event);
  }

  changeDropdown(name, value) {
    this.props.changeFilter({ [name]: value });
    this.props.fetchTeasers({ ...this.props.filterConfig, ...{ [name]: value } });
  }

  toggleSectionVisibility(key, event) {
    if (this.props.visibility[key]) {
      this.props.toggleVisibility({
        applyButtonOffsetTop: `${event.target.parentNode.offsetTop + 20}px`,
      });
    }
    this.props.toggleVisibility({ [key]: !this.props.visibility[key] });
  }

  resetCurrentFilter(filter) {
    this.props.resetCurrentFilter(filter);
    setTimeout(() => this.applyFilter(), 100);
  }

  resetFilter() {
    this.props.resetFilter();
  }

  render() {
    const { filterView, filterConfig, filterCounts } = this.props;
    const { loadingCount, applyButtonVisibility, applyButtonOffsetTop, } = this.props.visibility;

    const isTextInputsChanged = (inputsName) => (
      (+filterConfig[inputsName].from !== +window.filterConfig()[inputsName].from ||
      +filterConfig[inputsName].to !== +window.filterConfig()[inputsName].to) ? 1 : 0);

    const disableClassname = access ? '' : '__disabled';
    const noAccessBlock = () => (
      !access
        ? document.querySelector('#noAccessBlock').style = 'block'
        : null
    );

    const isDatapickerChanged = (filterConfig.date.from !== window.filterConfig().date.from ||
              filterConfig.date.to !== window.filterConfig().date.to ||
              filterConfig.onlyNew !== window.filterConfig().onlyNew);

    return (
      <div className="c-vertical-filter" style={{ position: 'relative' }}>

        <div
          className={
            `c-vertical-filter__settings-group ${
              isDatapickerChanged
              ? '__selected'
              : ''
            } ${disableClassname}`
          }
          onClick={noAccessBlock}
        >
          <div className="c-vertical-filter__settings-group-t">
            <strong>Период показа</strong>
            { access
              ? isDatapickerChanged && <div className="right link"onClick={this.resetCurrentFilter.bind(null, 'date')} >
                Сбросить
              </div>
              : <i className="ion-locked right" /> }

          </div>
          <div className="mb1">
            <Datepicker
              ref="datepicker"
              opens="right"
              allRange="24.02.2012"
              startDate={moment(filterConfig.date.from, 'DD MM YYYY')}
              endDate={moment(filterConfig.date.to, 'DD MM YYYY')}
              setDate={this.changeDate}
              applyDate={this.applyFilter}
            />
          </div>

          <Checkbox
            checked={filterConfig.onlyNew}
            disabled={!access}
            onChange={e => this.changeCheckbox(filterView.onlyNew.name, e)}
          >
            {filterView.onlyNew.title}
          </Checkbox>

        </div>

        {filterView.filterSections.map(filter => (
          <FilterSection
            key={filter}
            {...filterView[filter]}
            selectedItems={filterConfig[filter]}
            name={filter}
            onChange={this.changeCheckboxes}
            onReset={this.resetCurrentFilter}
          />
        ))}


        <div className={`c-vertical-filter__settings-group ${isTextInputsChanged('lifetime') ? '__selected' : ''}` } >
          <div className="c-vertical-filter__settings-group-t">
            <strong>Время жизни</strong>
            {' '}
            {!!isTextInputsChanged('lifetime') &&
            <div className="right link" onClick={() => this.resetCurrentFilter('lifetime')} >
              Сбросить
            </div>}
          </div>
          <div>
            {Object.keys(filterView.lifetime).map((key, index) => (
              <InputItem
                placeholder={filterView.lifetime[key].placeholder}
                value={filterConfig.lifetime[key]}
                key={index}
                validate="numbers"
                className="field __sm mr1"
                type="text"
                onBlur={() => this.validateTo('lifetime', key)}
                onChange={e => this.changeInputs('lifetime', key, e)}
              />
            ))}
            дней
          </div>
        </div>

        <button className="[ button __primary __block ] mb1" onClick={this.applyFilter} >
          Применить
        </button>

        <div className="center link" onClick={this.resetFilter} >
          Сбросить все фильтры
        </div>

        {applyButtonVisibility &&
        <div
          className="c-vertical-filter_flying-submit" style={{ top: applyButtonOffsetTop }} onClick={this.applyFilter}
        >
            Применить фильтр
        </div>}
      </div>
    );
  }
}

Filters.propTypes = {
  filterView: React.PropTypes.object,
  filterCounts: React.PropTypes.object,
  filterConfig: React.PropTypes.object,
  resetFilter: React.PropTypes.func,
  fetchTeasers: React.PropTypes.func,
  fetchData: React.PropTypes.func,
  setCounts: React.PropTypes.func,
  resetCurrentFilter: React.PropTypes.func,
  changeFilter: React.PropTypes.func,
  toggleVisibility: React.PropTypes.func,
  visibility: React.PropTypes.object,
};


function mapStateToProps(state) {
  return {
    filterCounts: state.filterCounts,
    filterView: state.filterView,
    filterConfig: state.filterConfig,
    visibility: state.visibility,
  };
}


// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     toggleVisibility,
//     changeFilter,
//     resetFilter,
//     resetCurrentFilter,
//     fetchTeasers }, dispatch);
// }

export default connect(mapStateToProps, actions)(Filters);
