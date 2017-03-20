

import React           from 'react';
import Rater           from '../advertika/rater';
import CellGeoDD       from '../advertika/CellGeoDD';
import CellGeoList     from '../advertika/CellGeoList';
import CellGreenRed    from '../advertika/CellGreenRed';
import CellPayments    from '../advertika/CellPayments';
import CellPartnersDD  from '../advertika/CellPartnersDD';
import CellTextDD      from '../advertika/CellTextDD';
import CellImageLink   from '../advertika/CellImageLink';
import CellImageListDD from '../advertika/CellImageListDD';
import CellTrend       from '../advertika/CellTrend';
import CellAudience    from '../advertika/CellAudience';
import CellCoverage    from '../advertika/CellCoverage';
import CellAJAXLink    from '../advertika/CellAJAXLink';
import IGTmb           from '../advertika/IGTmb';
import PriceVK         from '../advertika/PriceVK';


const SortableTableBody = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    columns: React.PropTypes.array.isRequired,
    sortings: React.PropTypes.array.isRequired,
  },

  render() {
    var bodies = this.props.data.map((item, index) => {
      return (
        <SortableTableRow key={index} data={item} columns={this.props.columns} />
      );
    });

    return (
      <tbody>
        {bodies}
      </tbody>
    );
  },
});

const SortableTableRow = React.createClass({
  render() {
    const tds = this.props.columns.map((item, index) => {
      const value = this.props.data[item.key];
      const id = this.props.data.id;

      return (
        <td key={index} style={item.dataStyle} className={item.className}>{Draw(item, value, id)}</td>
      );
    });

    return (
      <tr>
        {tds}
      </tr>
    );
  },
});

const Draw = (column, value, id) => {

  switch (column.type) {
    case 'redGreen':
      return <CellGreenRed data={value} />;
    case 'rate':
      return <Rater total={5} {...value} url={column.url} />;
    case 'image':
      return <img className="img-responsive" src={value.img} alt={value.title} />;
    case 'link':
      return (!!value.url ? <a href={value.url}>{value.title || value.url}</a> : value.title);
    case 'listlinks':
      return (
        <ul>
          {value.map((item, i) => (
            <li key={i}>
              <a href={item.url} target="_blank">
                {item.title || item.url}
              </a>
            </li>
          ))}
        </ul>
      );
    case 'ajaxLink':
      return <CellAJAXLink {...column} data={value} id={id} />;
    case 'imglink':
      return <CellImageLink {...column} data={value} />;
    case 'payments':
      return <CellPayments {...column} data={value} />;
    case 'listimage':
      return <CellImageListDD data={value} limit={column.limit} declension={column.declension} />;
    case 'geo':
      return value ? <CellGeoDD data={value} limit={column.limit} /> : null;
    case 'geolist':
      return value ? <CellGeoList data={value} limit={column.limit} anchor={column.anchor} /> : null;
    case 'partners':
      return <CellPartnersDD data={value} limit={column.limit} />;
    case 'textList':
      return <CellTextDD data={value} limit={column.limit} declension={column.declension} />;
    case 'ellipsis':
      return <div className="ellipsis">{value}</div>;
    case 'country':
      return (
        <span>
          <span className={`i-geo ${value.img.toLowerCase()}`} style={{ verticalAlign: 'middle' }} />
          {value.name}
        </span>
      );
    case 'textlink':
      return <a href={value.link}>{value.text}</a>;
    case 'btnExtLink':
      return <a className="button __xs __wsnorm __primary" target="_blank" href={value}>{column.btnTitle}</a>;
    case 'status':
      return (
        <div>
          <i
            className={`h3 ${value.val ? 'ion-android-checkmark txt-success' : 'ion-android-close txt-danger'}`}
          />
          <div>обновлен</div>
          <div>{value.updated}</div>
        </div>
      );
    case 'textimg':
      return (/(.png)|(.jpg)/gi).test(value) ? <img className="img-responsive" src={value} /> : value;
    case 'countAds':
      return <span>{value.countActive} <span className="txt-disabled">({value.countAll})</span></span>;
    case 'trend':
      return <CellTrend data={value} />;
    case 'audience':
      return <CellAudience data={value} />;
    case 'pricevk':
      return <PriceVK data={value} txt={column.txt} />;
    case 'coverage':
      return <CellCoverage data={value} />;
    case '2val':
      return `${value[Object.keys(value)[0]]} / ${value[Object.keys(value)[1]]}`;
    case 'igtmb':
      return <IGTmb {...value} txt={column.btntext} />;
    case 'igpubname':
      return <a target="_blank" href={value.inLink}>@{value.username}</a>;
    case 'startUpdated':
      return (
        value.split('/').map((date, i) => (
          i === 0
          ? <div key={i}>{date}</div>
          : <div key={i} className="txt-disabled">{date}</div>
      )));
    case 'iglistlnd':
      return (
        value.length
          ? value.map((c, i) => (
            <div className="link-box __sm" key={i}>
              <span className="link-box_link">
                {c.replace(/(https:\/\/)|(http:\/\/)/gi, '')}
              </span>
              {' '}
              <a
                className="link-box_ico"
                style={{ fontSize: '16px !important', lineHeight: '17px' }}
                href={c}
                target="_blank"
              />
            </div>
          ))
          : null
      );
    case 'overflowY':
      return <div style={{ overflowY: 'auto', height: column.overflowH }}>{value}</div>;
    case '2valtemp':
      return (
        Object.keys(value).map(c => (
          <div key={c}>
            {`${value[c][Object.keys(value[c])[0]]} / ${value[c][Object.keys(value[c])[1]]}`}
          </div>
      )));
    default :
      return value;
  }
};

module.exports = SortableTableBody;
