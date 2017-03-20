import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions_analytics';
import moment from 'moment';
import Highcharts from 'react-highcharts';
import Dropdown from '../../../../components/advertika/dropdown';
import Datepicker from '../../../../components/advertika/DateRangePicker';
import ChartAndTable from '../components/ChartAndTable';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';



class Analytics extends Component {
  constructor(props) {
    super(props);

    this.filter = {
      dateStart: moment().subtract(29, 'days').format('DD.MM.YYYY'),
      dateEnd: moment().format('DD.MM.YYYY'),
      quickSets: 0,
    };

    this.setDate = this.setDate.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    // this.handleToggleChart = this.handleToggleChart.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.changeQuickSets = this.changeQuickSets.bind(this);
  }


  componentWillMount() {
    if (this.props.loaded === false) {
      this.applyFilter({
        ...this.props.filter,
        dateStart: moment().subtract(29, 'days').format('DD.MM.YYYY'),
        dateEnd: moment().format('DD.MM.YYYY'),
      });
    }
  }

  setDate(dateStart, dateEnd) {
    this.props.changeFilter({
      dateStart,
      dateEnd,
    });
  }

  changeQuickSets(id) {
    this.props.changeQuickSets(id);
    this.applyFilter({
      ...this.props.filter,
      quickSets: id,
    });
  }

  resetFilters() {
    // this.refs.datepicker.reset();
    this.props.resetFilters();
    this.props.changeFilter({
      dateStart: moment().subtract(29, 'days').format('DD.MM.YYYY'),
      dateEnd: moment().format('DD.MM.YYYY'),
    });
    this.applyFilter({
      dateStart: moment().subtract(29, 'days').format('DD.MM.YYYY'),
      dateEnd: moment().format('DD.MM.YYYY'),
      quickSets: 0,
    });
  }

  changeFilter(key, val) {
    this.props.changeFilter({ [key]: val });
  }


  // handleToggleChart(series, i) {
  //   this.state[`series${series}`][i].visible = !this.state[`series${series}`][i].visible;
  //   this.setState({ [`series${series}`]: this.state[`series${series}`] });
  // }

  applyFilter(options = this.props.filter) {
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      options,
      (result) => {
        if (result.access !== false) {
          this.props.loadFilteredData({
            access: true,
            loaded: true,
            loading: false,
            series1: result.snAndGeo.series1,
            series2: result.snAndGeo.series2,
            data1: result.snAndGeo.data1,
            data2: result.snAndGeo.data2,
            series3: result.dmgr.series3,
            series4: result.dmgr.series4,
            series5: result.dmgr.series5,
            filter: { ...this.props.filter, ...options },
          });
          this.refs.ads.refresh();
          this.refs.countries.refresh();
        } else {
          this.props.loadFilteredData({
            access: result.access,
            loaded: true,
            loading: false,
          });
        }
      }
    );
  }

  render() {
    const chart3 = { ...this.props.HighchartDemographyMan, series: this.props.series3 };
    const chart4 = { ...this.props.HighchartDemography, series: this.props.series4 };
    const chart5 = { ...this.props.HighchartDemographyWoman, series: this.props.series5 };

    const dropdownData = (data) => data.map(
        c => ({
          name: c.name,
          id: c.name,
          checked: c.visible,
          visible: c.visible,
        })
      );

    return (
    <div>
      {this.props.loading &&
      <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
        <div className="indeterminate"></div>
      </div>}

          {this.props.access

            ? this.props.loaded &&

              (
                <div className="clearfix">
                  <div className="[ container ] fhp">
                    <div className="fhp_resetfilters" onClick={this.resetFilters}>
                      Очистить фильтры <i className="ion-close-circled"></i>
                    </div>
                    {this.props.dropdowns.map((item, i) => (
                      <div className="left col-25" key={i}>
                        <Dropdown
                          {...item}
                          index={i}
                          ref={i}
                          items={item}
                          filterName={item.filterName}
                          title={item.title}
                          subtitle={item.subtitle}
                          onChange={this.changeFilter}
                          applySelected={this.applyFilter}
                        />
                      </div>
                    ))}
                      <div className="left col-25">

                        <Datepicker
                          ref="datepicker"
                          title="Период показа:"
                          setDate={this.setDate}
                          applyDate={this.applyFilter}
                          // dateStart={this.props.filter.dateStart}
                          // dateEnd={this.props.filter.dateEnd}
                          startDate={moment(this.props.filter.dateStart, 'DD MM YYYY')}
                          endDate={moment(this.props.filter.dateEnd, 'DD MM YYYY')}
                          opens="left"
                        />

                      </div>
                      <div className="left col-25" style={{ paddingTop: '26px' }}>

                      {this.props.quickSets.map(button => (
                          <button
                            key={button.id}
                            className={`button col_half ${button.checked ? '__primary' : '__default'}`}
                            style={{ marginRight: '-1px' }}
                            onClick={this.changeQuickSets.bind(this, button.id)}
                          >
                            {button.title}
                          </button>

                        ))}

                      </div>

                  </div>
                  <ChartAndTable
                    ref="ads"
                    filterSubTitle="Рекламные сети"
                    dropdownData={dropdownData(this.props.series1)}
                    style={{ marginTop: 20 }}
                    chartConfig={this.props.HighchartConfig}
                    chartData={this.props.series1}
                    data={this.props.data1}
                    columns={this.props.columns1}
                    series="1"
                    // onToggleChart={this.handleToggleChart}
                  >
                    Рекламные сети
                    {' '}
                    <i
                      className="ion-help-circled txt-primary"
                      data-tip={
                        `Рекламные сети, в которых были показаны объявления этого оффера. <br>
                        Для просмотра графиков по другим рекламным  сетям измените <br>настройки фильтра по сетям.`
                      }
                    />
                  </ChartAndTable>

                  <ChartAndTable
                    ref="countries"
                    filterSubTitle="Страны"
                    dropdownData={dropdownData(this.props.series2)}
                    chartConfig={this.props.HighchartConfig}
                    chartData={this.props.series2}
                    data={this.props.data2 }
                    columns={this.props.columns2}
                    series="2"
                    // onToggleChart={this.handleToggleChart}
                  >
                    Страны
                    {' '}
                    <i
                      className="ion-help-circled txt-primary"
                      data-tip={
                        `Страны, в которых показываются объявления <br>
                        этого оффера. Для просмотра графиков по другим <br>
                        странам измените настройки фильтра по странам.`
                      }
                    />
                  </ChartAndTable>


                  { this.props.series4.length > 0 && !this.props.loading
                      ? (
                        <div>
                          <h3>
                            Демография
                            {' '}
                            <i
                              className="ion-help-circled txt-primary"
                              data-tip={
                                `Данные о структуре целевой аудитории <br>
                                доступны для социальных сетей ВК и Таргет@mail.ru`
                              }
                            />
                          </h3>
                          <div className="clearfix">
                            <div className="left col-33">
                              <Highcharts config={chart3} />
                            </div>
                            <div className="left col-33">
                              <Highcharts config={chart4} />
                            </div>
                            <div className="left col-33">
                              <Highcharts config={chart5} />
                            </div>
                          </div>
                        </div>
                      )
                      : (
                        <div className="note-user" >
                          <span className="ion-android-search"></span>
                          <span className="text">
                            По рекламным сетям,
                            в которых были показаны объявления этого оффера,
                            демографические данные отсутствуют.
                            Данные о структуре целевой аудитории доступны для социальных сетей ВК и myTarget.
                          </span>
                        </div>
                      )}

                  <ReactTooltip place="top" type="light" effect="float" multiline />
                </div>
                )

            : (
              <div className="no-acces-bg">
                <span>
                  Для Вашего тарифа информация по аналитике отсутствует.
                  Для получения полного доступа перейдите на тариф Всё включено.
                </span>
                <a className="[ button __success __lg ]" href="/cabinet/info/tarif">Выбрать платный тариф</a>
              </div>
            )}

    </div>
    );
  }
}


Analytics.propTypes = {
  url: PropTypes.string,
  HighchartDemographyMan: PropTypes.object,
  HighchartDemography: PropTypes.object,
  HighchartDemographyWoman: PropTypes.object,
  HighchartConfig: PropTypes.object,
  filter: PropTypes.object,
  series1: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  series2: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  series3: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  series4: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  series5: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  data1: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  data2: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  columns2: PropTypes.array,
  columns1: PropTypes.array,
  dropdowns: PropTypes.array,
  quickSets: PropTypes.array,
  changeFilter: PropTypes.func,
  togglePreloader: PropTypes.func,
  loadFilteredData: PropTypes.func,
  resetFilters: PropTypes.func,
  changeQuickSets: PropTypes.func,
  loading: PropTypes.bool,
  access: PropTypes.bool,
  loaded: PropTypes.bool,
};


function mapStateToProps(state) {
  return {
    url: state.Analytics.url,
    HighchartDemographyMan: state.Analytics.HighchartDemographyMan,
    HighchartDemography: state.Analytics.HighchartDemography,
    HighchartDemographyWoman: state.Analytics.HighchartDemographyWoman,
    HighchartConfig: state.Analytics.HighchartConfig,
    dropdowns: state.Analytics.dropdowns,
    columns1: state.Analytics.columns1,
    columns2: state.Analytics.columns2,
    quickSets: state.Analytics.quickSets,
    series1: state.Analytics.series1,
    series2: state.Analytics.series2,
    series3: state.Analytics.series3,
    series4: state.Analytics.series4,
    series5: state.Analytics.series5,
    data1: state.Analytics.data1,
    data2: state.Analytics.data2,
    loaded: state.Analytics.loaded,
    loading: state.Analytics.loading,
    access: state.Analytics.access,
    filter: state.Analytics.filter,
  };
}


export default connect(mapStateToProps, actions)(Analytics);
