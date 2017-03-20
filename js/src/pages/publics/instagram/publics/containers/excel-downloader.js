import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import WrapperDropdown from '../../../../../components/advertika/wrapper-dropdown';
import Checkbox from '../../../../../components/advertika/CheckboxV2';
import { saveState } from '../../../../../components/localStorage';
import * as actions from '../actions';

const mapStateToProps = ({ downloadConfig, selectedIds, visibility, filterConfig: { geo } }) => ({
  downloadConfig,
  selectedIds,
  visibility,
  geo,
});

@connect(mapStateToProps, actions)
export default class ExcelDownloader extends Component {
  static propTypes = {
    selected: PropTypes.number,
    downloadConfig: PropTypes.array,
    selectedIds: PropTypes.array,
    changeDownloadConfig: PropTypes.func,
    notificationSystem: PropTypes.func,
    downloadedXLS: PropTypes.func,
    visibility: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedCategory: 0,
      items: [],
      allIds: [],
    };
  }

  componentWillMount() {
    if (!window.access || window.trial) return;
    $.get('/public/ig/export/getAllXlsFields', data => {
      const allIds = Object.keys(data);

      this.setState({
        items: allIds.map(key => ({ title: data[key], id: key })),
        allIds,
      });
    }, 'json');
  }

  handleSelectCategory(selectedCategory) {
    this.setState({
      selectedCategory,
    });
  }

  toggleChecboxItem(listCheckedIds, id, checked) {
    if (Array.isArray(id)) {
      switch (checked) {
        case false:
          return listCheckedIds.filter(item => id.indexOf(item) === -1); // удаляем переданные елементы
        case true:
          return [...listCheckedIds, ...id]; // добавляем переданные елементы
        default :
          return id; // заменяем все переданным массивом
      }
    }
    if (checked && listCheckedIds.indexOf(id) === -1) {
      return [...listCheckedIds, id]; // добавляем елемент
    }
    return listCheckedIds.filter(element => element !== id); // удаляем елемент
  }

  toggleChecbox(id, event) {
    const { target: { checked } } = event;
    const { downloadConfig: listCheckedIds, changeDownloadConfig } = this.props;
    const newCheckedIds = this.toggleChecboxItem(listCheckedIds, id, checked);
    saveState(newCheckedIds, '_TS_IG_downloadCfg');
    changeDownloadConfig(newCheckedIds);
  }

  // toggleCategory(categoryItemsIds, event) {
  //   const { target: { checked } } = event;
  //   const { downloadConfig: listCheckedIds, changeDownloadConfig } = this.props;
  //   changeDownloadConfig(this.toggleChecboxItem(listCheckedIds, categoryItemsIds, checked));
  // }

  handleDownloadXSL() {
    const { downloadConfig, selectedIds, downloadedXLS, notificationSystem, geo } = this.props;
    if (selectedIds.length === 0) {
      notificationSystem({
        message: 'Не выбран ни один паблик для выгрузки!',
        level: 'error',
        autoDismiss: 5,
        position: 'tc',
      });
      return;
    }
    if (downloadConfig.length === 0) {
      notificationSystem({
        message: 'Не выбраны параметры для выгрузки!',
        level: 'error',
        autoDismiss: 5,
        position: 'tc',
      });
      return;
    }
    this.DownloadDropdown.handleCloseDropdown();
    downloadedXLS();
    window.location = `
      /public/ig/export/export?type=xls&ids=${selectedIds.toString()}&geo=${geo}&fields=${downloadConfig.toString()}
    `;
  }
  showLockModal(e) {
    if (window.access) return;
    document.querySelector('#js-noaccess-modal-fordownload').style.display = 'block';
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { selectedIds, downloadConfig, visibility } = this.props;
    const selected = selectedIds.length;
    const { selectedCategory, allIds, items } = this.state;

    // const allIds = [].concat(...window.settingsListDownload().map(({ items }) => items.map(({ id }) => id)));

    const renderSubList = (sublist) => (
      <div className="inline-block align-top p1" style={{ maxHeight: '300px', overflowY: 'scroll', position: 'relative' }}>
        {sublist.map(({ title, id }) => (
          <div className="mb1" key={id}>
            <Checkbox
              checked={downloadConfig.indexOf(id) > -1}
              onChange={event => this.toggleChecbox(id, event)}
            >
              {title}
            </Checkbox>
          </div>
        ))}
      </div>
    );

    return (
      <div className="allvam">
        <WrapperDropdown
          ref={DownloadDropdown => { this.DownloadDropdown = DownloadDropdown; }}
          select={false}
          // wrapClass={cx({ __locked: !window.access || window.trial })}
          positionClass="__ddright"
          wrapStyle={{ display: 'inline-block' }}
          applySelected={this.applyFilter}

          title={
            <button
              className="button __primary __sm"
              type="button"
              onClick={this.showLockModal}
            >
              Скачать в Excel
            </button>
          }
        >
          <div className="p1 ellipsis border-bottom">
            <span className="link" onClick={event => this.toggleChecbox(allIds, event)}>Выбрать все</span>
            {' | '}
            <span className="link" onClick={event => this.toggleChecbox([], event)}>Снять Выделение</span>
          </div>
          <div className="ellipsis" style={{ position: 'relative' }}>

            {renderSubList(items)}
          </div>
          <div className="a-right p1 border-top">
            <button className="button __primary" type="button" onClick={this.handleDownloadXSL}>
              {visibility.downloading
                ? 'Скачиваем'
                : 'Скачать'}
            </button>
          </div>
        </WrapperDropdown>
    {/*    <Checkbox className="px1">
          Выделить 500 первых
        </Checkbox>*/}

        {!!selected &&
          <span className="px1">
            <span>Выделено:</span> <span className="txt-success">{selected}</span> <span>из 500</span>
          </span>
        }
      </div>
    );
  }
}
