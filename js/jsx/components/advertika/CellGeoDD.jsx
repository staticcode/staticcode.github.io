import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { declOfNum } from './helpers';

class CellGeoDD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }
  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ open: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleClick() {
    this.setState({ open: !this.state.open });
    document.addEventListener('click', this._outsideClick);
  }

  render() {
    const { limit, data } = this.props;
    const { open } = this.state;
    const declension = ['страна', 'страны', 'стран'];
    const listItem = (geo, i) => (
      <span className={`i-geo  ${geo.img}`} key={i} style={{ verticalAlign: 'middle' }} data-tip={geo.country} />
    );

    const opener = (
      data.length > limit &&
      <span onClick={this.handleClick} data-tip="" className="cell-dropdown_toggle" />
    );

    const ddContent = (
      open &&
      <div className="cell-dropdown_cnt">
        <div>
          {data.map((geo, i) => listItem(geo, i))}
        </div>
      </div>
    );

    return (
      <div className={`cell-dropdown ${open ? '__open' : ''}`}>
        <div
          className="cell-dropdown_header"
          style={{ lineHeight: '25px', padding: data.length > limit ? false : '0px' }}
        >
          {!(data.length > limit) && data.map((geo, i) => listItem(geo, i))}
          {data.length > limit &&
            <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle' }}>
              {`${data.length} ${declOfNum(data.length, declension)}`}
            </span>
          }
          {opener}
        </div>
        {ddContent}
      </div>
    );
  }
}

CellGeoDD.defaultProps = {
  limit: 1,
};

CellGeoDD.propTypes = {
  limit: PropTypes.number,
  data: PropTypes.array,
};

export default CellGeoDD;

