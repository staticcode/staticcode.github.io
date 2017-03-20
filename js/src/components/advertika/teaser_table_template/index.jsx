import React, { Component, PropTypes } from 'react';
import Checkbox from '../CheckboxV2';
import LinkBox from '../link_box';

class TeazersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {items, selectedTeasers, toggleTeaserSelection, toggleAllTeasersSelection} = this.props;
    if (!items.length) {
      return null;
    }
    const countIdsContainInSelected = selectedTeasers.filter(
      teaserId => items.map(i => i.id).indexOf(teaserId) !== - 1
    ).length;
    const tHead = (
      <thead>
        <tr>
          <th width="40">
            <Checkbox
              checked={ items.length === countIdsContainInSelected }
              partChecked={countIdsContainInSelected && countIdsContainInSelected !== items.length}
              onChange={e => toggleAllTeasersSelection(e)}
            />
          </th>
          <th width="120">
            Картинка
          </th>
          <th>
            Заголовок
          </th>
          <th>
            Описание
          </th>
          <th width="120">
            Индексация
          </th>
          <th width="100">
            Показов
          </th>
          <th width="125">
            География
          </th>
          <th>
            Лендинг
          </th>
        </tr>
      </thead>
    );

    const tBody = () => (
      <tbody>
        {items.map(tr => (
            <tr key={tr.id}>
              <td>
                <Checkbox
                  id={tr.id}
                  checked={selectedTeasers.indexOf(tr.id) !== - 1}
                  onChange={e => toggleTeaserSelection(tr.id, e)}
                />
              </td>
              <td>
                <a href={`/teazer/show/${tr.id}`}>
                  <img src={tr.img} className="img-responsive" alt />
                </a>
              </td>
              <td>
                {tr.title &&
                <a href={`/teazer/show/${tr.id}`}>
                  {tr.title}
                </a>
                }
              </td>
              <td>
                <a href={`/teazer/show/${tr.id}`}>
                {tr.description}
                </a>
              </td>
              <td>
                {tr.indexing.replace('<br />', '')}
              </td>
              <td className="center">
                <i className={`i-tn ${tr.net.name}`} data-tip={tr.net.title} />
                {` ${tr.hits}`}
              </td>
              <td className="center">
                {tr.geo.map(ico => (
                  <i className={`i-geo ${ico.code.toLowerCase()}`} data-tip={ico.name} key={ico.code} />
                  ))}
              </td>
              <td>
              {!!tr.lnd &&
                <div>
                  Лендинг:
                  <LinkBox href={tr.lnd.linkIn} title={tr.lnd.title} extHref={tr.lnd.linkOut} />
                </div>}

              {!!tr.plnd &&
                <div>
                  Прелендинг:
                  <LinkBox href={tr.plnd.linkIn} title={tr.plnd.title} extHref={tr.plnd.linkOut} />
                </div>}
              </td>
            </tr>
          ))}
      </tbody>
    );

    return (
      <table className="tbl" style={{ margin: 0 }}>
        {tHead}
        {tBody()}
      </table>
    );
  }
}

TeazersTable.propTypes = {
  items: PropTypes.array,
  selectedTeasers: PropTypes.array,
};

export default TeazersTable;
