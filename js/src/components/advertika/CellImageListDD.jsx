import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { declOfNum } from './helpers';

const CellImageListDD = React.createClass({
  getDefaultProps() {
    return {
      limit: 1,
    };
  },

  getInitialState() {
    return {
      open: false,
    };
  },

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ open: false });
      document.removeEventListener('click', this._outsideClick);
    }
  },

  handleClick() {
    this.setState({ open: !this.state.open });
    document.addEventListener('click', this._outsideClick);
  },

  render() {
    const { data, declension, limit } = this.props;
    const dataLength = data.length;
    const Item = (data, i) => (
      <img
        key={i}
        className="img-responsive"
        src={data.img}
        style={{ maxWidth: 100 }}
        alt={data.title}
        data-tip={data.title}
      />
    );

    const opener = (
      dataLength > limit
      && <span onClick={this.handleClick} data-tip="" className="cell-dropdown_toggle" />
    );

    const ddContent = (
      this.state.open &&
      <div className="cell-dropdown_cnt">
        {data.map((image, i) => Item(image, i))}
      </div>
    );

    return (
    <div className={'cell-dropdown ' + (this.state.open ? '__open' : '')}>
      <div className="cell-dropdown_header" style={dataLength > limit ? null : { padding: 0 }}>

        {dataLength > limit
        ? (
          <span style={{ display: 'inline-block', width: 'calc(100% - 30px)', textAlign: 'center', verticalAlign: 'middle' }}>
            {`${data.length} ${declOfNum(data.length, declension)}`}
          </span>
        )
        : data.map((image, i) => Item(image, i))}
        {opener}
      </div>
      {ddContent}

    </div>
    );
  },
});

export default CellImageListDD;
