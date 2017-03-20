import React, { Component } from 'react';
import { connect } from 'react-redux';
import LinkBox from '../../../../components/advertika/link_box';
import { flatLinePreloader } from '../../../../components/advertika/helpers';
import TeaserTemplate from '../../../../components/advertika/mytarget_ad_template';
import AdDetailInfo from '../../../../components/advertika/mytarget_ad_template/tpl_side';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import * as actions from '../actions/';
import Toolbar from './toolbar';
import Tabs from './tabs';
import NorificationSystem from 'react-notification-system';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};



    this.toggleTeaserSelection = this.toggleTeaserSelection.bind(this);
    this.toggleAllTeasersSelection = this.toggleAllTeasersSelection.bind(this);
    this.selectGroupTeasers = this.selectGroupTeasers.bind(this);
    this._openNotification = this._openNotification.bind(this);
  }

  _openNotification(message) {
    this.refs.notificationSystem.addNotification(message);
  }

  exportsAds(method, ids = this.props.selectedTeasers, notificationSystem = this._openNotification) {
    if (ids.length === 0) {
      return notificationSystem({
        message: 'Не выбрано ни одно объявление!',
        level: 'error',
        autoDismiss: 5,
        position: 'tc',
      });
    }

    if (ids.length > 300) {
      notificationSystem({
        message: `При выгрузке в ${method}, за раз не более 300 объявлений`,
        level: 'success',
        autoDismiss: 0,
        position: 'tc',
      });
    }

    window.location = `/zip/mtm?method=${method}&ads=${ids.filter((c, i) => i < 300).join(',')}`;
    return null;
  }

  toggleTeaserSelection(id, { target: { checked } }) {
    if (!checked) {
      this.props.selectTeaser(id);
    } else {
      this.props.deselectTeaser(id);
    }
  }

  toggleAllTeasersSelection({ target: { checked } }) {
    const ids = this.props.teasers.items.map(teaser => teaser.id);
    if (checked) {
      this.props.selectGroupTeasers(ids);
    } else {
      this.props.deselectGroupTeasers(ids);
    }
  }

  selectGroupTeasers() {
    const { tabsData, visibility: { tab } } = this.props;
    const ids = tabsData[tab].items.map(teaser => teaser.id);
    this.props.selectGroupTeasers(ids);
  }


  render() {
    const {
      deselectAllTeasers,
      incrementFavoritesCoun,
      decrementFavoritesCoun,
      selectedTeasers,
      visibility,
    } = this.props;


    return (
      <div>
        {visibility.loading && flatLinePreloader()}
        <div className="container">
          <div className="mb2">
            <a className="back_list" href="/mytarget/mobile">К списку объявлений</a>
          </div>
          <div className="row mb3">
            <div className="left col-65">
              <div className="col-35 left">
                <TeaserTemplate disabled checkboxHidden {...window.adInfo} />
              </div>
              <AdDetailInfo classNames="left col-65 m-ad-detail-info" fullCard {...window.adInfo} colWidth="30%" />
            </div>
            <div className="left col-35">
              <h4>
                {'Список редиректов '}
                <i
                  className="ion-help-circled txt-primary"
                  data-tip={`
                    Список всех адресов перенаправления пользователя от рекламного объявления до лендинга.<br>
                    Это могут быть трекеры, партнерки, системы аналитики и т.д."
                  `}
                />
              </h4>


              {window.access
                ? window.redirects.map((redirect, i) => (
                  <LinkBox title={redirect} extHref={redirect} key={i} />
                ))

                : <div className="alert __danger">
                  Список редиректов недоступен для перехода по ссылкам. <br />
                  <a href="/cabinet/info/tarif">Перейти на платный тариф</a>
                </div>}
            </div>
          </div>

          <Tabs />

          <NorificationSystem
            ref="notificationSystem"
            allowHTML
            style={{
              Containers: { tc: { top: '25%' } },
              NotificationItem: {
                DefaultStyle: { boxShadow: '0 0 30px rgba(0,0,0, .7)', padding: '20px' },
              },
            }}
          />

        </div>
        <Toolbar {...{
          deselectAllTeasers,
          notification: this._openNotification,
          selectGroupTeasers: this.selectGroupTeasers,
          exportToZip: () => this.exportsAds('zip'),
          }}
        />
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}

App.propTypes = {
  selectedTeasers: React.PropTypes.array,
  visibility: React.PropTypes.object,
  tabsData: React.PropTypes.object,

  savedFilters: React.PropTypes.object,
  teasers: React.PropTypes.object,
  changeFilter: React.PropTypes.func,
  fetchTeasers: React.PropTypes.func,
  fetchData: React.PropTypes.func,
  addNewProject: React.PropTypes.func,
  toolbarProjects: React.PropTypes.object,
  addTeasersToProject: React.PropTypes.func,
  incrementFavoritesCoun: React.PropTypes.func,
  decrementFavoritesCoun: React.PropTypes.func,
  loadProjectsList: React.PropTypes.func,
  loadNetList: React.PropTypes.func,
  deselectAllTeasers: React.PropTypes.func,
  selectTeaser: React.PropTypes.func,
  deselectTeaser: React.PropTypes.func,
  selectGroupTeasers: React.PropTypes.func,
  deselectGroupTeasers: React.PropTypes.func,

};


const mapStateToProps = ({ visibility, teasers, selectedTeasers, tabsData }) => ({
  visibility,
  teasers,
  selectedTeasers,
  tabsData,
});

export default connect(mapStateToProps, { ...actions })(App);
