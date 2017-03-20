import React, { Component, PropTypes } from 'react';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as actions from '../actions';

// import GeoDropdown from 'components/advertika/geo-dropdown';
import SearchableGeoSelect from './searchable-geo-select';


import Btn from 'components/advertika/btnitem';
import Checkbox from 'components/advertika/CheckboxV2';
import RadioButton from 'components/advertika/Radio_button';
import Inputs from 'components/advertika/double-text-inputV2';


const mapStateToProps = ({
  filterView,
  filterConfig,
  visibility: { applyButtonVisibility, applyButtonOffsetTop },
}) => ({
  filterConfig,
  filterView,
  applyButtonVisibility,
  applyButtonOffsetTop,
});

@connect(mapStateToProps, actions)
export default class Filters extends Component {

  static propTypes = {
    className: PropTypes.string,
    applyButtonOffsetTop: PropTypes.string,
    applyButtonVisibility: PropTypes.bool,
    changeFilter: PropTypes.func,
    applyFilter: PropTypes.func,
    fetchData: PropTypes.func,
    resetFilter: PropTypes.func,
    setDetailFilterProp: PropTypes.func,
    toggleVisibility: PropTypes.func,
    filterView: PropTypes.object,
    filterConfig: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {

    };
  }

  onChangeGeo(geo) {
    this.props.changeFilter(geo);

    this.props.fetchData({ ...this.props.filterConfig, ...geo });
  }

  handleApplyFilter() {
    this.props.fetchData(this.props.filterConfig);
  }

  showApplyButton(event) {
    const { parentNode } = event.target;
    this.props.toggleVisibility({
      applyButtonVisibility: true,
      applyButtonOffsetTop: `${parentNode.offsetTop + (parentNode.offsetHeight / 2)}px`,
    });
  }

  changeCheckboxes(name, id, event) {
    const { checked } = event.target;
    this.props.changeFilter({
      [name]: checked
        ? [...(this.props.filterConfig[name] || []), id]
        : (this.props.filterConfig[name] || []).filter(itemId => itemId !== id),
    });
    this.showApplyButton(event);
  }

  changeRadio(name, val, event) {
    this.props.changeFilter({ [name]: val });
    this.showApplyButton(event);
  }

  changeCheckbox(name, event) {
    const { checked } = event.target;
    this.props.changeFilter({ [name]: checked });
    this.showApplyButton(event);
  }

  changeRange(key, val, event) {
    this.props.changeFilter({ [`${key}f`]: val.from, [`${key}t`]: val.to });
    this.showApplyButton(event);
  }

  changeDoubleInput(key, val, event) {
    this.props.changeFilter({ [key]: val });
    this.showApplyButton(event);
  }

  render() {
    const {
      filterView,
      filterConfig,
      resetFilter,
      applyButtonVisibility,
      applyButtonOffsetTop,
    } = this.props;

    return (
      <div className={`mb2 ${this.props.className}`}>
          <div className="center">
            <span className="piblics-ig_reset-filters" onClick={resetFilter}>
              Сбросить фильтры
            </span>
          </div>

          <div className={cx('c-vertical-filter__settings-group', { __disabled: !window.access })}>
            <div className="c-vertical-filter__settings-group-t">
              <strong>Количество подписчиков</strong>
              <i
                className="right ion-help-circled txt-primary"
                data-tip={`
                  Количество пользователей подписанных на профиль
                `}
              />
            </div>
            <div className="c-vertical-filter__settings-group-cnt mb1">
              <Inputs
                {...filterView.followed}
                parentClass="__title-top __title-bold"
                from={filterConfig.followed && filterConfig.followed.from || ''}
                to={filterConfig.followed && filterConfig.followed.to || ''}
                pressEnter={this.handleApplyFilter}
                onChange={this.changeDoubleInput}
              />

            </div>
            <div className="c-vertical-filter__settings-group-t">
              <strong>Гео подписчиков</strong>
              <i
                className="right ion-help-circled txt-primary"
                data-tip={`
                  При выборе страны выводятся профили <br>с долей подписчиков от 20% до 100%
                `}
              />
            </div>
            <SearchableGeoSelect
              // title="Гео подписчиков"
              items={filterView.geo.items}
              selectedItem={filterConfig.geo}
              onChange={this.onChangeGeo}
            />

            <div className="c-vertical-filter__settings-group-t">
              <strong>% Подписчиков по гео</strong>
              <i
                className="right ion-help-circled txt-primary"
                data-tip={`
                  Чтобы выбрать только те профили, <br >
                  на которые подписано нужное количество пользователей, <br >
                  выберите страну и укажите диапазон в процентах.
                `}
              />
            </div>
            <Inputs
              name="gp"
              parentClass="__title-top __title-bold"
              from={filterConfig.gpf && filterConfig.gpf || ''}
              to={filterConfig.gpt && filterConfig.gpt || ''}
              plfrom="от"
              plto="до"
              pressEnter={this.handleApplyFilter}
              onChange={this.changeRange}
            />
          </div>
          <div className={cx('c-vertical-filter__settings-group', { __disabled: !window.access })}>
            <div className="c-vertical-filter__settings-group-t">
              <strong>Пол подписчиков</strong>
              <i
                className="right ion-help-circled txt-primary"
                data-tip={`
                  При выборе пола выводятся профили с долей <br> подписчиков этого пола в них от 51% до 100%
                `}
              />
            </div>
            <div className="c-vertical-filter__settings-group-cnt mb1">

              <RadioButton
                checked={filterConfig.sex || '0'}
                items={filterView.sex}
                onChange={(val, event) => this.changeRadio('sex', val, event)}
              />
            </div>
            {(filterConfig.sex !== undefined) && (filterConfig.sex !== '0') &&
              <Inputs
                name="s"
                parentClass="__title-top __title-bold"
                from={filterConfig.sf && filterConfig.sf || ''}
                to={filterConfig.st && filterConfig.st || ''}
                pressEnter={this.handleApplyFilter}
                plfrom="от"
                plto="до"
                onChange={this.changeRange}
              />}
          </div>

          <div className={cx('c-vertical-filter__settings-group', { __disabled: !window.access })}>
            <div className="c-vertical-filter__settings-group-t">
              <strong>Возраст подписчиков</strong>
              <i
                className="right ion-help-circled txt-primary"
                data-tip={`
                  При выборе нескольких категорий, <br >
                  будут показаны профили, <br >
                  в которых больше всего подписчиков <br >
                  хотя бы одной из выбранных возрастных групп.
                `}
              />
            </div>
            <div className="c-vertical-filter__settings-group-cnt">
              {filterView.age.map(ageItem => (
                <Checkbox
                  key={ageItem.id}
                  checked={!!filterConfig.age && filterConfig.age.indexOf(ageItem.id) > -1}
                  onChange={e => this.changeCheckboxes('age', ageItem.id, e)}
                >
                  {ageItem.title}
                </Checkbox>
              ))}
            </div>
          </div>

          <div className={cx('c-vertical-filter__settings-group mb1', { __disabled: !window.access })}>
            <div className="c-vertical-filter__settings-group-cnt">
              <div className="mb1">
                <Checkbox
                  checked={!!filterConfig.in_exchange}
                  onChange={e => this.changeCheckbox('in_exchange', e)}
                >
                  Есть на бирже
                  <i
                    className="right ion-help-circled txt-primary"
                    data-tip={`
                      Выберите этот фильтр, чтобы увидеть только <br >те профили которые есть на рекламных биржах.
                    `}
                  />
                </Checkbox>
              </div>
            </div>

                <div className="mb1">
                  <div className="c-vertical-filter__settings-group-t">
                    <strong>Цена поста на бирже, руб</strong>
                  </div>
                  <Inputs
                    name="post_cost"
                    parentClass="__title-top __title-bold"
                    from={filterConfig.post_cost && filterConfig.post_cost.from || ''}
                    to={filterConfig.post_cost && filterConfig.post_cost.to || ''}
                    pressEnter={this.handleApplyFilter}
                    onChange={this.changeDoubleInput}
                  />
                </div>
                <div className="mb1">
                  <div className="c-vertical-filter__settings-group-t">
                    <strong>% Рекламных постов</strong>
                    <i
                      className="right ion-help-circled txt-primary"
                      data-tip={`
                        Доля рекламных постов среди общего числа публикаций профиля
                      `}
                    />
                  </div>
                  <Inputs
                    name="adv_percent"
                    parentClass="__title-top __title-bold"
                    from={filterConfig.adv_percent && filterConfig.adv_percent.from || ''}
                    to={filterConfig.adv_percent && filterConfig.adv_percent.to || ''}
                    pressEnter={this.handleApplyFilter}
                    onChange={this.changeDoubleInput}
                  />
                </div>

                <div className="c-vertical-filter__settings-group-t">
                  <strong>ER, %</strong>
                  <i
                    className="right ion-help-circled txt-primary"
                    data-tip={`
                      Среднее значение вовлеченности аудитории профиля за месяц.<br>
                      ER поста = (Количество лайков + Количество комментариев) / Количество подписчиков х 100%
                    `}
                  />
                </div>
                <Inputs
                  {...filterView.er_avg}
                  parentClass="__title-top __title-bold"
                  from={filterConfig.er_avg && filterConfig.er_avg.from || ''}
                  to={filterConfig.er_avg && filterConfig.er_avg.to || ''}
                  pressEnter={this.handleApplyFilter}
                  onChange={this.changeDoubleInput}

                />
            </div>
          <div className="center">
            <Btn className="__primary" onClick={this.handleApplyFilter}>Применить фильтр</Btn>
          </div>

          {applyButtonVisibility &&
            <div
              className="c-vertical-filter_flying-submit"
              style={{
                top: applyButtonOffsetTop,
              }}
              onClick={this.handleApplyFilter}
            >
              Применить фильтр
            </div>
          }
      </div>
    );
  }
}
