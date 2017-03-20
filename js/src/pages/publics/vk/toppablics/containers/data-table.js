/* eslint-disable react/prefer-stateless-function*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Table from '../../../../../components/react-sortable-tableV2/';
import CellImageLink from '../../../../../components/advertika/CellImageLink';
import CellAudience from '../../../../../components/advertika/CellAudience';
import CellGeoList from '../../../../../components/advertika/CellGeoList';
import PriceVK from '../../../../../components/advertika/PriceVK';
import CellCoverage from '../../../../../components/advertika/CellCoverage';
import Checkbox from '../../../../../components/advertika/CheckboxV2';
import * as actions from '../actions/';

const mapStateToProps = ({ tableData, selectedIds }) => ({
  selectedIds,
  tableData,
});


@connect(mapStateToProps, actions)
export default class DataTable extends Component {
  static propTypes = {
    tableData: PropTypes.object,
    onSort: PropTypes.func,
    selectedIds: PropTypes.array,
    selectPublic: PropTypes.func,
    deselectPublic: PropTypes.func,
    selectPublicsOnPage: PropTypes.func,
    deselectPublicsOnPage: PropTypes.func,
    notificationSystem: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = { };
  }

  toggleSelection(checked, id) {
    const { notificationSystem, selectedIds } = this.props;

    if (checked) {
      if (selectedIds.length > (window.exportLimit - 1)) {
        notificationSystem({
          message: `Возможный лимит для выгрузки ${window.exportLimit}`,
          level: 'warning',
          autoDismiss: 5,
          position: 'tc',
        });
      } else {
        this.props.selectPublic(id);
      }
    } else {
      this.props.deselectPublic(id);
    }
  }

  togglePageSelection(checked) {
    const { selectedIds, tableData, selectPublicsOnPage, deselectPublicsOnPage, notificationSystem } = this.props;
    const ids = tableData.items.map(row => row.id);
    const canAddIds = window.exportLimit - selectedIds.length;
    if (checked) {
      if (canAddIds < ids.length) {
        notificationSystem({
          message: `Возможный лимит для выгрузки ${window.exportLimit}`,
          level: 'warning',
          autoDismiss: 5,
          position: 'tc',
        });
        selectPublicsOnPage(ids.splice(0, canAddIds));
      } else {
        if (canAddIds === 0) {
          notificationSystem({
            message: `Возможный лимит для выгрузки ${window.exportLimit}`,
            level: 'warning',
            autoDismiss: 5,
            position: 'tc',
          });
        } else {
          selectPublicsOnPage(ids);
        }
      }
    } else {
      deselectPublicsOnPage(ids);
    }
  }

  render() {
    const { tableData, onSort, selectedIds } = this.props;
    const { access } = window;
    const countIdsContainInSelected = selectedIds.filter(
      teaserId => tableData.items.map(i => i.id).indexOf(teaserId) !== - 1
    ).length;
    const columns = [
      {
        sortable: false,
        key: 'id',
        width: '43',
        header: (
          <Checkbox
            checked={ tableData.items.length === countIdsContainInSelected }
            partChecked={countIdsContainInSelected && countIdsContainInSelected !== tableData.items.length}
            onChange={event => this.togglePageSelection(event.target.checked)}
          />
        ),
        render: data => (
          <Checkbox
            checked={selectedIds.indexOf(data) > -1}
            onChange={event => this.toggleSelection(event.target.checked, data)}
          />
        ),
        dataProps: {
          className: 'center',
        },
      }, {
        header: 'Название',
        sortable: access,
        key: 'public',
        type: 'imglink',
        render: data => <CellImageLink data={data} blank />,
        width: '200',
      }, {
        header: 'Аудитория',
        tooltip: `
          Количество подписчиков сообщества.<br>Верхнее значение -
          общее кол-во подписчиков<br>Нижнее (зеленое) - кол-во
          добавленных за сутки подписчиков.
        `,
        sortable: access,
        key: 'audience',
        type: 'audience',
        defaultSorting: 'desc',
        headerStyle: {
          cursor: access ? 'pointer' : 'default',
        },
        dataProps: {
          className: 'center',
        },
        render: data => <CellAudience data={data} />,
        width: '110',
      }, {
        header: 'Ботов',
        tooltip: 'Часть не активных аккаунтов.',
        sortable: access,
        key: 'bot',
        headerStyle: {
          cursor: access ? 'pointer' : 'default',
        },
        dataProps: {
          className: 'center',
        },
        width: '70',
      }, {
        header: 'Пол М / Ж',
        sortable: access,
        key: 'sex',
        dataProps: {
          className: 'center',
        },
        headerStyle: {
          whiteSpace: 'normal',
          cursor: access ? 'pointer' : 'default',
        },
        render: data => `${data[Object.keys(data)[0]]} / ${data[Object.keys(data)[1]]}`,

        width: '80',
      }, {
        header: 'Средний возраст',
        sortable: access,
        key: 'ageAvg',
        headerStyle: {
          whiteSpace: 'normal',
          cursor: access ? 'pointer' : 'default',
        },
        dataProps: {
          className: 'center',
        },
        width: '80',
      }, {
        header: 'Гео',
        sortable: false,
        anchor: 'countries',
        key: 'geo',
        render: (data, rowData) => (
          data ? <CellGeoList data={data} anchor="countries" anchorLink={rowData.public.link} /> : null),
        width: '110',
      }, {
        header: 'Цена поста',
        tooltip: 'Цена за размещение поста через биржи.',
        sortable: access,
        key: 'pricePost',
        render: data => <PriceVK data={data} />,
        headerStyle: {
          cursor: access ? 'pointer' : 'default',
        },
        width: '110',
      }, {
        header: 'CPM',
        tooltip: 'Стоимость 1000 показов рекламы в группе.',
        sortable: access,
        key: 'cpm',
        render: data => <PriceVK data={data} txt="-" />,
        headerStyle: {
          whiteSpace: 'normal',
          cursor: access ? 'pointer' : 'default',
        },
        width: '90',
      }, {
        header: 'Охват пост / охват день',
        tooltip: `
          Охват пост - cреднее  количество пользователей, <br>просматривающих запись сообщества<br>
          <br>Охват день - cреднесуточное количество пользователей, <br>просматривающих все записи сообщества
        `,
        sortable: access,
        key: 'coverage',
        render: data => <CellCoverage data={data} />,
        headerStyle: {
          whiteSpace: 'normal',
          cursor: access ? 'pointer' : 'default',
        },
        limit: 4,
        width: '140',
      }, {
        header: 'ER пост / ER день',
        tooltip: `
          Вовлечение (engagement rate) - коэффициент активности аудитории в сообществе. <br>
          Рассчитывается по формуле: <br>ER пост=(лайки+репосты+комментарии) /
          (количество постов*количество подписчиков) <br>ER день=(лайки+репосты+комментарии) /
          (количество дней*количество подписчиков).
        `,
        tooltipPlace: 'left',
        sortable: access,
        key: 'er',
        render: data => Object.keys(data).map(c => (
          <div key={c}>
            {`${data[c][Object.keys(data[c])[0]]} / ${data[c][Object.keys(data[c])[1]]}`}
          </div>
        )),
        headerStyle: {
          cursor: access ? 'pointer' : 'default',
          whiteSpace: 'normal',
        },
        dataProps: {
          className: 'center',
        },
        width: '150',
      },
    ];
    return (
      <Table
        className="tbl __fzsm __center"
        data={tableData.items}
        onSort={onSort}
        columns={columns}
      />
  );
  }
}
