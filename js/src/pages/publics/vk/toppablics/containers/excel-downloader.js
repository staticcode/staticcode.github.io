import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import WrapperDropdown from '../../../../../components/advertika/wrapper-dropdown';
import Checkbox from '../../../../../components/advertika/CheckboxV2';
import { saveState } from '../../../../../components/localStorage';

import * as actions from '../actions';

const mapStateToProps = ({ downloadConfig, selectedIds, visibility }) => ({
  downloadConfig,
  selectedIds,
  visibility,
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
    };
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
    saveState(newCheckedIds, '_TS_VK_downloadCfg');
    changeDownloadConfig(newCheckedIds);
  }

  toggleCategory(categoryItemsIds, event) {
    const { target: { checked } } = event;
    const { downloadConfig: listCheckedIds, changeDownloadConfig } = this.props;
    const newCheckedIds = this.toggleChecboxItem(listCheckedIds, categoryItemsIds, checked);
    saveState(newCheckedIds, '_TS_VK_downloadCfg');
    changeDownloadConfig(newCheckedIds);
  }

  handleDownloadXSL() {
    const { downloadConfig, selectedIds, downloadedXLS, notificationSystem } = this.props;
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
    $.post('/public/vk/export/export', {
      ids: selectedIds.toString(),
      fields: downloadConfig.toString(),
      type: 'xls',
    }, ({ success, file }) => {
      if (success) {
        window.location = `/uploadFile/xls?filename=${file}`;
      }
    }, 'json');
  }

  render() {
    const { selectedIds, downloadConfig, visibility } = this.props;
    const selected = selectedIds.length;
    const { selectedCategory } = this.state;

    const allIds = [].concat(...window.settingsListDownload().map(({ items }) => items.map(({ id }) => id)));

    const renderCategories = (categories) => (
      <div className="inline-block align-top px1">
        {categories.map(({ title, items }, index) => {
          const itemsLength = items.length;
          const selectedInCategoy = items.filter(({ id }) => downloadConfig.indexOf(id) > -1).length;
          return (
            <div className="ellipsis mb1" key={index}>
              <Checkbox
                partChecked={
                  items.filter(({ id }) => downloadConfig.indexOf(id) > -1).length &&
                  items.filter(({ id }) => downloadConfig.indexOf(id) > -1).length !== itemsLength
                }
                checked={itemsLength === selectedInCategoy}
                onChange={event => this.toggleCategory(items.map(({ id }) => id), event)}
              />
              <strong
                className={cx({ 'txt-success': index === selectedCategory })}
                style={{ cursor: 'pointer' }}
                onClick={event => this.handleSelectCategory(index, event)}
              >
                { title}
              </strong>
              {' '}
              {selectedInCategoy}
              {' / '}
              {itemsLength}
            </div>
          );
        })}
      </div>
    );

    const renderSubList = (sublist) => (
      <div className="inline-block align-top px1" style={{ position: 'relative' }}>
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
      <div>
        <WrapperDropdown
          ref={DownloadDropdown => { this.DownloadDropdown = DownloadDropdown; }}
          //
          wrapClass={cx({ __locked: !window.access || window.trial })}
          select={false}
          positionClass="__ddright"
          wrapStyle={{ display: 'inline-block' }}
          applySelected={this.applyFilter}
          title={
            <button
              className="button __primary"
              type="button"
              // disabled={selected < 1}
            >
              Скачать в Excel
            </button>
          }
        >
          <div className="p1 ellipsis border-bottom mb1">
            <span className="link" onClick={event => this.toggleChecbox(allIds, event)}>Выбрать все</span>
            {' | '}
            <span className="link" onClick={event => this.toggleChecbox([], event)}>Снять Выделение</span>
          </div>
          <div className="ellipsis">
            {renderCategories(window.settingsListDownload())}
            {renderSubList(window.settingsListDownload()[selectedCategory].items)}
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
            <span>Выделено:</span> <span className="txt-success">{selected}</span> <span>из {window.exportLimit}</span>
          </span>
        }
      </div>
    );
  }
}
