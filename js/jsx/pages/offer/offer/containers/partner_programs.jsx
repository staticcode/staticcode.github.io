import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Btnitem from '../../../../components/advertika/btnitem';
import SortableTable from '../../../../components/react-sortable-table/sortable-table';
import Dropdown from '../../../../components/advertika/dropdown';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import GeoDropdown from '../../../../components/advertika/geo-dropdown';
import CheckboxesDropdown from '../../../../components/advertika/checkboxes-dropdown';
import * as actions from '../actions/actions_partner_programs';


class PartnerPrograms extends Component {
  constructor(props) {
    super(props);

    this.resetFilters = this.resetFilters.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.handleToggleStatus = this.handleToggleStatus.bind(this);
  }

  componentWillMount() {
    if (!this.props.data.length) {
      this.applyFilter();
    }
  }

  resetFilters() {
    this.props.resetStore();
    setTimeout(() => this.applyFilter(), 100);
  }

  changeFilter(key, val) {
    this.props.changeFilter({ [key]: val });
  }

  handleToggleStatus(val) {
    this.props.togglePreloader(true);
    const Status = !val ? [1] : undefined;
    this.props.changeFilter({ Status });
    this.props.toggleStatus({ status: { ...this.props.status, value: !val } });
    setTimeout(() => this.applyFilter(), 100);
  }

  handleSort(column, sort) {
    const filter = { ...this.props.filter, sort, column };
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      { ...filter, page: this.props.filter.page - 1 },
      result => {
        this.props.loadSortedData({ ...result, filter });
      }
    );
  }

  applyFilter() {
    const filter = this.props.filter;
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      { ...filter, page: 0 },
      result => {
        this.props.loadFilteredData(result);
      }
    );
  }

  loadNext() {
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      { ...this.props.filter, loadnext: true },
      result => {
        this.props.loadNextData(result);
      }
    );
  }

  render() {
    return (
      <div className="clearfix">
        {this.props.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>
        }
        <div className="[ container ] fhp">
          <div className="fhp_resetfilters" onClick={this.resetFilters}>
            Очистить фильтры <i className="ion-close-circled"></i>
          </div>
          {this.props.dropdowns.map((item, i) => (
            <div
              className="left px1"
              style={{ width: `${item.width}%` }}
              key={i}
            >
                <CheckboxesDropdown
                  {...item}
                  checkedItems={this.props.filter[item.filterName]}
                  onChange={this.changeFilter}
                  applySelected={this.applyFilter}
                />
          {/*    <Dropdown
                          {...item}
                          index={i}
                          ref={item.filterName}
                          items={item}
                          filterName={item.filterName}
                          title={item.title}
                          subtitle={item.subtitle}
                          onChange={this.changeFilter}
                          applySelected={this.applyFilter}

                        />*/}
            </div>
          ))}

          <div
            className="left px1"
            style={{ width: '23%' }}
          >
            <GeoDropdown
              {...this.props.geoDropdown}
              checkedItems={this.props.filter.countries}
              onChange={this.changeFilter}
              applySelected={this.applyFilter}
            />
          </div>
          <div className="left px1 center" style={{ width: '6%' }}>
            <div
              className="fhp_title"
              style={{ marginBottom: '5px', fontWeight: 'bold' }}
            >
              {`${this.props.status.title}:`}
            </div>
            <button
              className={`button __lg ion-android-checkmark ${this.props.filter.Status ? '__success' : '__default'}`}
              onClick={this.handleToggleStatus.bind(this, this.props.filter.Status)}
            />
          </div>
        </div>
        {!!this.props.data.length &&
          <div>
            <SortableTable
              className="tbl __fzsm __center"
              onSort={this.handleSort}
              data={this.props.data}
              columns={this.props.tableColumns}
            />

            <div className="center mb4">
              {this.props.data.length !== this.props.totalGoals &&
                <Btnitem
                  className="__primary"
                  onClick={ this.loadNext }
                  disabled={ this.props.loading }
                >
                  {(!this.props.loading ? 'Загрузить еще' : 'Загрузка')}
                </Btnitem>
              }
              {this.props.data.length &&
                <div>
                  <small>
                    {`Отображается ${this.props.data.length} из ${this.props.totalGoals}`}
                  </small>
                </div>
              }
            </div>
          </div>
        }
        {!this.props.data.length && !this.props.loading &&
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

PartnerPrograms.propTypes = {
  url: PropTypes.string,
  dropdowns: PropTypes.array,
  tableColumns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
  status: PropTypes.object,
  filter: PropTypes.object,
  totalGoals: PropTypes.number,
  page: PropTypes.number,
  changeFilter: PropTypes.func,
  loadNextData: PropTypes.func,
  toggleStatus: PropTypes.func,
  resetStore: PropTypes.func,
  loadSortedData: PropTypes.func,
  togglePreloader: PropTypes.func,
  loadFilteredData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    dropdowns: state.PartnerPrograms.dropdowns,
    geoDropdown: state.PartnerPrograms.geoDropdown,
    status: state.PartnerPrograms.status,
    data: state.PartnerPrograms.data,
    loading: state.PartnerPrograms.loading,
    totalGoals: state.PartnerPrograms.totalGoals,
    page: state.PartnerPrograms.page,
    url: state.PartnerPrograms.url,
    tableColumns: state.PartnerPrograms.tableColumns,
    filter: state.PartnerPrograms.filter,
  };
}

export default connect(mapStateToProps, actions)(PartnerPrograms);
