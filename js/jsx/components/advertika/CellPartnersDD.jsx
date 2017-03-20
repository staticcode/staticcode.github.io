import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const CellPartnersDD = React.createClass({
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
      this.setState({
        open: false,
      });
      document.removeEventListener('click', this._outsideClick);
    }
  },

  handleClick() {
    this.setState({
      open: !this.state.open,
    });
    document.addEventListener('click', this._outsideClick);
  },
  render() {
    if (this.props.data.data) {
      const listItem = (data, i) => (
        <li key={i} data-tip={data.name}>
          <span className={`cell-dropdown_lititle ${data.img === false && 'txt-disabled'}`} >{data.name}</span>
          {data.img !== undefined &&
            <i className={data.img ? 'ion-android-checkmark txt-success' : 'ion-android-close txt-danger' } />}
        </li>
      );
      const opener = (
        this.props.data.data.length > this.props.limit
        ? <span onClick={this.handleClick} data-tip="" className="cell-dropdown_toggle" />
        : null
      );

      const ddContent = (
        this.state.open
          ? (
            <div className="cell-dropdown_cnt">
              <ul className="cell-dropdown_ul">
                {this.props.data.data.map((data, i) => listItem(data, i))}
              </ul>
            </div>
          )

          : null
      );

      return (
        <div className={'cell-dropdown ' + (this.state.open ? '__open' : '')}>
          <div className="cell-dropdown_header center">
            <span style={{ display: 'inline-block', lineHeight: '23px', whiteSpace: 'nowrap' }}>
              {`${this.props.data.count || ''} ${this.props.data.name}`}
            </span>
            {opener}
          </div>
          {ddContent}

        </div>
      );
    } else {
      return null;
    }
  },
});

export default CellPartnersDD;
