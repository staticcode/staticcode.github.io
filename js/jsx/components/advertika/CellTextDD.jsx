import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { declOfNum } from './helpers';


class CellTextDD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({
        open: false,
      });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleClick() {
    this.setState({
      open: !this.state.open,
    });
    document.addEventListener('click', this._outsideClick);
  }

  render() {
    const { data, limit, declension } = this.props;

    const listItem = (item, i) => (
      <li key={i}>
        {item}
      </li>
    );

    const opener = (
      data.length > limit
      && <span onClick={this.handleClick} data-tip="" className="cell-dropdown_toggle" />
    );

    const ddContent = (
      this.state.open
        && (
          <div className="cell-dropdown_cnt">
            <ul className="cell-dropdown_ul">
              {data.map((li, i) => listItem(li, i))}
            </ul>
          </div>
        )
    );

    return (
      <div className={`cell-dropdown ${this.state.open ? '__open' : ''}`}>
        <div className={`${data.length > limit ? 'cell-dropdown_header' : ''} center`}>
          <span style={{ /*display: 'inline-block', lineHeight: '23px', whiteSpace: 'nowrap' */}}>
            {data.length > limit
              ? `${data.length} ${declOfNum(data.length, declension)}`
              : data }
          </span>
          {opener}
        </div>
        {ddContent}
      </div>
    );
  }
}

CellTextDD.defaultProps = {
  limit: 1,
};

CellTextDD.propTypes = {
  data: PropTypes.array,
  declension: PropTypes.array,
  limit: PropTypes.number,
};

export default CellTextDD;
