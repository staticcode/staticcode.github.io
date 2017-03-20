import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions_landing_page';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import SortableTable from '../../../../components/react-sortable-table/sortable-table';
import Btn from '../../../../components/advertika/btnitem';


class LandingPages extends Component {

  constructor(props) {
    super(props);

    this.showLnd = this.showLnd.bind(this);
    this.showPln = this.showPln.bind(this);
    this.loadNext = this.loadNext.bind(this);
  }

  componentWillMount() {
    const { data1, data2 } = this.props;
    if (!data1.length && !data2.length) {
      this.loadNext('1');

      setTimeout(() => {
        this.loadNext('2', true);
      }, 100);
    }
  }

  showLnd() {
    this.props.toggleTable(true);
  }

  showPln() {
    this.props.toggleTable(false);
    window.ga('send', 'pageview', '/virtual/prelending');
  }

  loadNext(numtab, endloading) {
    this.props.togglePreloader(true);
    window.$.getJSON(this.props[`url${numtab}`], { page: this.props[`page${numtab}`] }, result => {
      this.props.loadData({
        [`totalOffers${numtab}`]: result.totalCount,
        [`page${numtab}`]: this.props[`page${numtab}`] + 1,
        [`data${numtab}`]: this.props[`data${numtab}`].concat(result.dataList),
        access: result.access,
      });
      if (endloading) {
        this.props.togglePreloader(false);
      }
    });
  }

  render() {
    const numtab = this.props.tblToggle ? '1' : '2';
    const controls = (this.props.access && !!this.props.data1.length || !!this.props.data2.length) &&
              (
                <div className="col-30 mx-auto">
                  <Btn
                    className={`col_half ${this.props.tblToggle ? '__primary' : '__default'}`}
                    onClick={this.showLnd}
                  >
                    Лендинги
                  </Btn>
                  <Btn
                    className={`col_half ${this.props.tblToggle ? '__default' : '__primary'}`}
                    onClick={this.showPln}
                  >
                    Прелендинги
                  </Btn>
                </div>
              );
    const content = ((this.props[`data${numtab}`].length > 0) && this.props.access) &&
      <div>
        <SortableTable
          className="tbl __center"
          data={ this.props[`data${numtab}`] }
          columns={this.props[`tableColumns${numtab}`]}
        />

        <div className="center mb4">

          { (this.props[`data${numtab}`].length !== this.props[`totalOffers${numtab}`]) &&
            <Btn
              className="__primary"
              onClick={ this.loadNext.bind(this, numtab, true) }
              disabled={ this.props.loading }
            >
              {(!this.props.loading ? 'Загрузить еще' : 'Загрузка')}
            </Btn>
          }

          {this.props[`data${numtab}`].length &&
            <div>
              <small>
                {`Отображается ${this.props[`data${numtab}`].length} из ${this.props[`totalOffers${numtab}`]}`}
              </small>
            </div>
          }

        </div>
        <ReactTooltip place="top" type="light" effect="float" multiline ref="ReactTooltip" />
      </div>;

    return (
      <div>
        {this.props.loading &&
          <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
            <div className="indeterminate"></div>
          </div>
        }

        {this.props.access
          ? <div>
            {controls}
            {content}
          </div>
          : <div className="no-acces-bg">
            <span>
              Для Вашего тарифа информация по посадочным страницам оффера отсутствует.
              Для получения полного доступа перейдите на тариф Всё включено.
            </span>
            <a className="[ button __success __lg ]" href="/cabinet/info/tarif">
              Выбрать платный тариф
            </a>
          </div>}

        {(!this.props.loading && (this.props[`data${numtab}`].length === 0)) &&
          <div className="note-user" >
            <span className="ion-android-search"></span>
            <span className="text">
              Отсутствуют данные по данному офферу.
            </span>
          </div>
        }
      </div>
    );
  }
}


LandingPages.propTypes = {
  tableColumns1: PropTypes.array,
  tableColumns2: PropTypes.array,
  url1: PropTypes.string,
  url2: PropTypes.string,
  param1: PropTypes.object,
  param: PropTypes.object,
  data1: PropTypes.array,
  data2: PropTypes.array,
  page1: PropTypes.number,
  totalOffers1: PropTypes.number,
  totalOffers2: PropTypes.number,
  page2: PropTypes.number,
  tblToggle: PropTypes.bool,
  loading: PropTypes.bool,
  access: PropTypes.bool,
  loadData: PropTypes.func,
  toggleTable: PropTypes.func,
  togglePreloader: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    tableColumns1: state.LandingPage.tableColumns1,
    tableColumns2: state.LandingPage.tableColumns2,
    url1: state.LandingPage.url1,
    url2: state.LandingPage.url2,
    param1: state.LandingPage.param1,
    param: state.LandingPage.param,
    data1: state.LandingPage.data1,
    data2: state.LandingPage.data2,
    page1: state.LandingPage.page1,
    page2: state.LandingPage.page2,
    totalOffers1: state.LandingPage.totalOffers1,
    totalOffers2: state.LandingPage.totalOffers2,
    tblToggle: state.LandingPage.tblToggle,
    loading: state.LandingPage.loading,
    access: state.LandingPage.access,
  };
}


export default connect(mapStateToProps, actions)(LandingPages);
