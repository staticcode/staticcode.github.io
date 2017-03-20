import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Checkbox from '../../../../components/advertika/CheckboxV2';
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
    const {
      tnVisibility,
      loadingCount,
      geoVisibility,
      detailSettingsVisibility,
      applyButtonVisibility,
      applyButtonOffsetTop,
      popupVisibility,
    } = this.props.visibility;

    const isTextInputsChanged = (inputsName) => (
      (+filterConfig[inputsName].from !== +window.filterConfig()[inputsName].from ||
      +filterConfig[inputsName].to !== +window.filterConfig()[inputsName].to) ? 1 : 0);

    const countModifiedAdditionFilters = () => (
      (filterConfig.imgType && filterConfig.imgType.length ? 1 : 0)
      + (filterConfig.device && filterConfig.device.length ? 1 : 0)
      + (filterConfig.uniqueImages ? 1 : 0)
      + isTextInputsChanged('lifetime')
      + isTextInputsChanged('imgSize')
    );

    const disableClassname = access ? '' : '__disabled';
    const noAccessBlock = () => (
      !access
        ? document.querySelector('#noAccessBlock').style = 'block'
        : null
    );

    return (
      <div className="c-vertical-filter" style={{ position: 'relative' }}>
        <div
          className={
            `c-vertical-filter__settings-group ${
              (filterConfig.date.from !== window.filterConfig().date.from ||
              filterConfig.date.to !== window.filterConfig().date.to ||
              filterConfig.onlyNew !== window.filterConfig().onlyNew)
              ? '__selected'
              : ''
            } ${disableClassname}`
          }
          onClick={noAccessBlock}
        >
          <div className="c-vertical-filter__settings-group-t">
            <strong>Период показа</strong>
            { access
              ? <div className="right link"onClick={this.resetCurrentFilter.bind(null, 'date')} >
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


        <div className={`c-vertical-filter__settings-group ${filterConfig.tn && filterConfig.tn.length ? '__selected' : ''}`}>
          <div className="c-vertical-filter__settings-group-t">
            <strong>Тизерные сети ({filterView.tn.length})</strong>
            {' '}
            <div className="right link" onClick={ e => this.resetCurrentFilter('tn', e)} >
              Сбросить
            </div>
          </div>
          <div className="c-vertical-filter__settings-group-cnt">
            {filterView.tn.slice(0, !tnVisibility ? 10 : filterView.tn.length).map(teaserNet => (

                <Checkbox
                  key={teaserNet.id}
                  checked={filterConfig.tn && filterConfig.tn.indexOf(teaserNet.id) !== -1}
                  onChange={e => this.changeCheckboxes('tn', teaserNet.id, e)}
                >
                  <i className={`i-tn ${teaserNet.name}`}></i>
                  {' '}
                  <span>{teaserNet.title}</span>
                  <span className="c-vertical-filter_item-counter">
                    {loadingCount
                      ? <img src="/images/loading.gif" width="19px" />
                      : filterCounts.tn && filterCounts.tn[teaserNet.id]}
                  </span>
                </Checkbox>

            ))}
          </div>
          <button
            className="button __block __default"
            onClick={e => this.toggleSectionVisibility('tnVisibility', e)}
          >
            {!tnVisibility ? 'Показать все сети' : 'Только популярные сети'}
          </button>
        </div>

        <div
          className={`c-vertical-filter__settings-group ${
            filterConfig.geo && filterConfig.geo.length ? '__selected' : ''} ${disableClassname}`
          }
          onClick={noAccessBlock}
        >
          <div className="c-vertical-filter__settings-group-t">
            <strong>Гео ({filterView.geo.length})</strong>
            {' '}
            <Checkbox
              disabled={filterConfig.geo && !filterConfig.geo.length}
              checked={filterConfig.exactGeo}
              onChange={e => this.changeCheckbox(filterView.exactGeo.name, e)}
            >
              {filterView.exactGeo.title}
            </Checkbox>
            {!access && <i className="ion-locked right" />}
          </div>
          <div className="c-vertical-filter__settings-group-cnt">
          {filterView.geo.slice(0, !geoVisibility ? 4 : filterView.geo.length).map(country => (

            <Checkbox
              key={country.id}
              disabled={!access}
              checked={filterConfig.geo && filterConfig.geo.indexOf(country.id) !== -1}
              onChange={e => this.changeCheckboxes('geo', country.id, e)}
            >
              <span style={{ marginRight: 5 }} className={`i-geo ${country.name.toLowerCase()}`} />
              <span>{country.title}</span>
              <span className="c-vertical-filter_item-counter">
                {loadingCount
                  ? <img src="/images/loading.gif" width="19px" />
                  : filterCounts.geo && filterCounts.geo[country.id]}
              </span>
            </Checkbox>

          ))}

          </div>
          <button
            className="button __block __default"
            disabled={!access}
            onClick={this.toggleSectionVisibility.bind(this, 'geoVisibility')}
          >
            {!geoVisibility ? 'Показать все страны' : 'Только популярные страны'}
          </button>
        </div>

        <div
          className={`c-vertical-filter__settings-group ${
            filterConfig.adult ? '__selected' : ''} ${disableClassname}`
          }
          onClick={noAccessBlock}
        >
          <div className="c-vertical-filter__settings-group-cnt">
            <Checkbox
              checked={filterConfig.adult}
              disabled={!access}
              onChange={e => this.changeCheckbox(filterView.adult.name, e)}
            >
              <div
                style={{
                  display: 'inline-block',
                  verticalAligh: 'middle',
                  height: '24px',
                  width: '24px',
                  textAlign: 'center',
                  fontSize: '11px',
                  lineHeight: '24px',
                  backgroundColor: '#d43f3a',
                  color: '#fff',
                }}
              >
                18+
              </div>
              {' '}
              <span>{filterView.adult.title}</span>
              {access
                ? <span className="c-vertical-filter_item-counter">
                    {loadingCount
                      ? <img src="/images/loading.gif" width="19px" />
                      : filterCounts.adult}
                  </span>

                : <i className="ion-locked right" />
              }
            </Checkbox>
          </div>
        </div>

        <div
          className={`c-vertical-filter__settings-group border-none ${
          (filterConfig.netimg || filterConfig.dimention || filterConfig.ih || filterConfig.iw) ? '__selected' : ''
          }`}
        >
          <div className="c-vertical-filter__settings-group-t">
            <strong>Размеры изображений</strong>
            {' '}
            <div
              className="right link"
              // onClick={this.resetCurrentFilter.bind(null, 'dimention')}
              onClick={e => this.changeDimentionRadio('dimention', '', e)}
            >
              Сбросить
            </div>
          </div>
          <div className="c-vertical-filter__settings-group-cnt">
          {filterView.dimention.map(dimention => (
            <Checkbox
              key={dimention.id}
              type="radio"
              checked={+filterConfig.dimention === +dimention.id}
              onChange={e => this.changeDimentionRadio('dimention', dimention.id, e)}
            >
              <span>{dimention.title}</span>

            </Checkbox>

          ))}
          <div className="mt1 allvam">
            <span>Ш</span>
            <InputItem
              placeholder="ширина"
              value={filterConfig.iw}
              validate="numbers"
              className="center field __sm ml1"
              type="text"
              onChange={e => this.changeDimentionInputs('iw', e)}
            />
            <span className="px1">&#215;</span>
            <span>В</span>
            <InputItem
              placeholder="высота"
              value={filterConfig.ih}
              validate="numbers"
              className="center field __sm ml1"
              type="text"
              onChange={e => this.changeDimentionInputs('ih', e)}
            />

          </div>


          </div>
        </div>
        <button
          className={`button __default __block ${disableClassname}`}
          onClick={access ?this.toggleSectionVisibility.bind(this, 'detailSettingsVisibility') : noAccessBlock}
        >
          <i className="ion-gear-b __xl" />
          {' '}
          {!detailSettingsVisibility
            ? 'Детальная настройка'
            : 'Скрыть настройки'}
          {' '}
          {!!countModifiedAdditionFilters() &&
          <span data-tip={
            'Количество фильтров в блоке доп. настроек, <br> значения которых отличаются от значений по умолчанию'
            }
          >
            ({countModifiedAdditionFilters()})
          </span>}
        </button>

{/* ===================================== */}

        {detailSettingsVisibility &&
            <div className="">

              <div className={
                  `c-vertical-filter__settings-group ${isTextInputsChanged('lifetime') ? '__selected' : ''}`
                }
              >
                <div className="c-vertical-filter__settings-group-t">
                  <strong>Время жизни</strong>
                  {' '}
                  <div
                    className="right link"
                    onClick={() => this.resetCurrentFilter('lifetime')}
                  >
                    Сбросить
                  </div>
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

              <div className={`c-vertical-filter__settings-group ${filterConfig.imgType.length ? '__selected' : ''}`}>
                <div className="c-vertical-filter__settings-group-t">
                  <strong>Тип изображения</strong>
                </div>

                <div className="c-vertical-filter__settings-group-cnt">
                {filterView.imgType.map(type => (
                  <Checkbox
                    key={type.id}
                    checked={filterConfig.imgType.indexOf(type.id) !== -1}
                    onChange={e => this.changeCheckboxes('imgType', type.id, e)}
                  >
                    {type.title}
                    <span className="c-vertical-filter_item-counter">
                      {loadingCount
                        ? <img src="/images/loading.gif" width="19px" />
                        : filterCounts.imgType && filterCounts.imgType[type.id]}
                    </span>
                  </Checkbox>
                ))}
                </div>
              </div>

              <div className={`c-vertical-filter__settings-group ${filterConfig.device.length ? '__selected' : ''}`}>
                <div className="c-vertical-filter__settings-group-t">
                  <strong>Устройства просмотра</strong>
                </div>
                  <div className="center">
                    {filterView.device.map(item => (
                      <div className="col_third inline-block align-top" key={item.id}>
                        <Checkbox
                          design="ion"
                          ionClass={item.ionClass}
                          checked={filterConfig.device.indexOf(item.id) !== -1}
                          onChange={e => this.changeCheckboxes('device', item.id, e)}
                        />
                        <div className="h5 txt-disabled">
                          {loadingCount
                            ? <img src="/images/loading.gif" width="19px" />
                            : filterCounts.device && filterCounts.device[item.id]}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>

              <div className={`c-vertical-filter__settings-group ${filterConfig.uniqueImages ? '__selected' : ''}`}>
                  <Checkbox
                    checked={filterConfig.uniqueImages}
                    onChange={e => this.changeCheckbox(filterView.uniqueImages.name, e)}
                  >
                    {filterView.uniqueImages.title}
                  </Checkbox>
              </div>

              <div className={
                  `c-vertical-filter__settings-group border-none ${isTextInputsChanged('imgSize') ? '__selected' : ''}`
                }
              >
                <div className="c-vertical-filter__settings-group-t">
                  <strong>Вес изображения</strong>
                  {' '}
                  <div
                    className="right link"
                    onClick={() => this.resetCurrentFilter('imgSize')}
                  >
                    Сбросить
                  </div>
                </div>
                <div>
                  {Object.keys(filterView.imgSize).map((key, index) => (
                    <InputItem
                      placeholder={filterView.imgSize[key].placeholder}
                      value={filterConfig.imgSize[key]}
                      key={index}
                      validate="numbers"
                      className="field __sm mr1"
                      type="text"
                      onBlur={() => this.validateTo('imgSize', key)}
                      onChange={e => this.changeInputs('imgSize', key, e)}
                    />
                  ))}
                  кб
                </div>
              </div>

            <div className="button-group-2 mb1">
              <button
                className="button __primary __lg"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
                onClick={this.applyFilter}
              >
                Применить
              </button>
              <button
                className="button __default __lg"
                style={{ paddingTop: '3px', paddingBottom: '3px' }}
                onClick={() => this.props.toggleVisibility({ popupVisibility: !popupVisibility })}
              >
                Сохранить <br /> настройки
              </button>
            </div>
            <div
              className="center link"
              onClick={this.resetFilter}
            >
              Сбросить все фильтры
            </div>
          </div>
        }

          {applyButtonVisibility &&
            <div
              className="c-vertical-filter_flying-submit"
              style={{
                top: applyButtonOffsetTop,
              }}
              onClick={this.applyFilter}
            >
              Применить фильтр
            </div>
          }
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
