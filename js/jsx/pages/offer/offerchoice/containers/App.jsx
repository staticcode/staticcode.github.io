import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import moment from 'moment';
import SortableTable from '../../../../components/react-sortable-table/sortable-table';
import DateRangePicker from '../../../../components/advertika/DateRangePicker';
import Btnitem from '../../../../components/advertika/btnitem';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import Dropdown from '../../../../components/advertika/dropdown';
import Searchform from '../../../../components/advertika/searchform';
import Checkbox from '../../../../components/advertika/CheckboxV2';
import * as actions from '../actions';


export class Offerсhoice extends Component {

  constructor(props) {
    super(props);

    this.resetFilters = this.resetFilters.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeDatepicker = this.changeDatepicker.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.changeQuickSets = this.changeQuickSets.bind(this);
  }

  componentDidMount() {
    this.applyFilter();
  }

  resetFilters() {
    this.props.resetStore();
    this.refs.Searchform.handleReset();
    this.refs.SortableTable.resetState();
    // setTimeout(
    //   () => { this.applyFilter(); },
    //   100
    // );
  }

  changeQuickSets(id) {
    this.props.changeQuickSets(id);
    setTimeout(
      () => { this.applyFilter(); },
      100
    );
  }

  changeDatepicker(start, end) {
    this.changeFilter('date', { start, end });
    this.props.changeDatepicker({ date: { start, end } });
  }

  changeFilter(key, val) {
    this.props.changeFilter({ [key]: val });
  }

  toggleOnlyMotivated(e) {
    this.props.changeFilter({ onlyMotivated: e.target.checked });
    setTimeout(
      () => { this.applyFilter(); },
      100
    );
  }

  handleSort(column, sort) {
    const filter = this.props.filter;
    this.props.togglePreloader();
    this.props.changeHeadSoutceType(
      this.props.filter.tarsource !== 1
        ? this.props.filter.tarsource.join('')
        : 1
    );
    window.$.getJSON(
      this.props.url,
      { ...filter, ...{ column, sort, page: filter.page - 1 } },
      result => {
        this.props.loadSortedData({ ...result, column, sort });
      }
    );
  }

  applyFilter() {
    const filter = this.props.filter;
    this.props.changeHeadSoutceType(
      this.props.filter.tarsource !== 1
        ? this.props.filter.tarsource.join('')
        : 1
    );
    this.props.togglePreloader();
    window.$.getJSON(
      this.props.url,
      { ...filter, page: 0 },
      result => {
        this.props.loadFilteredData(result);
      }
    );
  }

  loadNext() {
    const filter = this.props.filter;
    this.props.changeHeadSoutceType(
      this.props.filter.tarsource !== 1
        ? this.props.filter.tarsource.join('')
        : 1
    );
    this.props.togglePreloader();

    window.$.getJSON(
      this.props.url,
      { ...filter, loadnext: true },
      result => {
        this.props.loadNextData(result);
      }
    );
  }

  render() {
    return (
      <div>

        {this.props.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>
        }

        <div className="offerchoice-filters">
          <div className="row mb1">
            <div className="left col-20" style={{ paddingTop: '18px' }}>
              <div className="mxn1 clearfix">
              {this.props.quickSets.map(btn => (
                <div className="left col_third px1" key={btn.id}>
                  <button
                    className={`button ${btn.checked ? '__primary' : '__default'} __block`}
                    onClick={this.changeQuickSets.bind(this, btn.id)}
                  >
                    {btn.title}
                  </button>

                </div>
              ))}

              </div>
            </div>
            <div className="left col-55" style={{ paddingTop: '11px' }}>
              <Searchform
                ref="Searchform"
                id="searchBar"
                placeholder="Поиск по названию или описанию оффера"
                name="inputField"
                classNames=" "
                onChange={this.changeFilter}
                onSubmit={this.applyFilter}
                value={this.props.inputField}
              />
            </div>
            <div className="left col-25" >
            <div className="ellipsis" title="Дата добавления в партнерскую сеть">
              Дата добавления в партнерскую сеть
            </div>
              <DateRangePicker
                ref="datepicker"
                opens="left"
                startDate={moment(this.props.date.start, 'DD MM YYYY')}
                endDate={moment(this.props.date.end, 'DD MM YYYY')}
                setDate={this.changeDatepicker}
                applyDate={this.applyFilter}
              />

            </div>
          </div>
          <div className="row">

            <div className="left col-20">


              {this.props.quickSets.filter(item => item.checked)[0].id === 'is_mobile' &&
                <Checkbox
                  checked={this.props.filter.onlyMotivated}
                  onChange={e => this.toggleOnlyMotivated(e)}
                >
                  Только мотивированные
                </Checkbox>}
            </div>
    {/*        <div className="left col-55 center">
              <button
                className="button __xs __primary __outline"
                onClick={this.props.toggleVisibilityFilter}
              >
                {this.props.visibilityFilter
                  ? 'Свернуть фильтр'
                  : 'Уточнить поиск'
                }
              </button>
            </div>*/}
            <div className="right col-25">
              <div
                onClick={this.resetFilters}
                style={{
                  zIndex: '1',
                  float: 'right',
                  cursor: 'pointer',
                  color: '#8abb00',
                  fontSize: '14px',
                }}
              >
                Очистить фильтры <i className="ion-close-circled"></i>
              </div>
            </div>
          </div>
          <div className="mxn1">
            <div
              className="clearfix col_full bg-default py1 "

            >
              {this.props.dropdowns.map((item, i) => (
                <div className="left px1" style={{ width: `${100 / this.props.dropdowns.length}%` }} key={i}>
                  <Dropdown
                    {...item}
                    index={i}
                    ref={item.filterName}
                    items={item}
                    inputType={item.inputType}
                    filterName={item.filterName}
                    title={item.title}
                    subtitle={item.subtitle}
                    onChange={this.changeFilter}
                    applySelected={this.applyFilter}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {!!this.props.offers.length &&
          <div>
            <SortableTable
              className="tbl __fzsm __center"
              ref="SortableTable"
              style={{ marginTop: '10px' }}
              data={this.props.offers}
              onSort={this.handleSort}
              columns={this.props.tableColumns}
            />
            <div className="center mb4">
              {this.props.offers.length !== this.props.totalOffers &&
                <Btnitem
                  className="__primary"
                  onClick={ this.loadNext }
                  disabled={ this.props.loading }
                >
                  {!this.props.loading ? 'Загрузить еще' : 'Загрузка'}
                </Btnitem>
              }
              <div>
                <small>{`Отображается  ${this.props.offers.length} из ${this.props.totalOffers}`}</small>
              </div>
            </div>
          </div>
        }
        {!this.props.offers.length && !this.props.loading &&
          <div className="center py4">
            <span
              style={{
                fontSize: '140px',
                display: 'inline-block',
                padding: '40px',
                color: '#d1d1d1',
              }}
            >
              &#9785;
            </span>
            <p className="h3">По вашему запросу ничего не найдено.</p>
            <p className="h3">Попробуйте изменить фильтры.</p>
          </div>
        }

        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}


// Offerсhoice.defaultProps = window.propsOfferсhoice();

Offerсhoice.propTypes = {
  tableColumns: PropTypes.array,
  dropdowns: PropTypes.array,
  quickSets: PropTypes.array,
  offers: PropTypes.array,
  url: PropTypes.string,
  date: PropTypes.object,
  filter: PropTypes.object,
  page: PropTypes.number,
  totalOffers: PropTypes.number,
  loading: PropTypes.bool,
  visibilityFilter: PropTypes.bool,
  inputField: PropTypes.string,
  loadSortedData: PropTypes.func,
  loadFilteredData: PropTypes.func,
  resetStore: PropTypes.func,
  togglePreloader: PropTypes.func,
  changeQuickSets: PropTypes.func,
  changeFilter: PropTypes.func,
  changeDatepicker: PropTypes.func,
  changeHeadSoutceType: PropTypes.func,
  toggleVisibilityFilter: PropTypes.func,
  loadNextData: PropTypes.func,
};


function mapStateToProps(state) {
  return {
    dropdowns: state.filters.dropdowns,
    inputField: state.filters.inputField,
    date: state.filters.date,
    visibilityFilter: state.filters.visibilityFilter,
    quickSets: state.filters.quickSets,
    offers: state.offersData.offers,
    loading: state.offersData.loading,
    totalOffers: state.offersData.totalOffers,
    page: state.filters.page,
    filter: state.filters.filter,
    url: state.filters.url,
    tableColumns: state.tableConfig.tableColumns,

  };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       resetStore,
//       loadFilteredData,
//       loadSortedData,
//       loadNextData,
//       togglePreloader,
//       changeDatepicker,
//       changeQuickSets,
//       toggleVisibilityFilter,
//       changeFilter,
//       changeHeadSoutceType,
//     },
//     dispatch
//   );
// }

export default connect(mapStateToProps, actions)(Offerсhoice);
