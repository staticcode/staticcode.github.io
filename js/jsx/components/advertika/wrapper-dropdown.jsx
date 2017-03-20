import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class WrapperDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleCloseDropdown = this.handleCloseDropdown.bind(this);
    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
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

  handleCloseDropdown() {
    this.setState({ open: false });
    document.removeEventListener('click', this._outsideClick);
  }

  handleOpenDropdown() {
    if (this.props.noActive) {
      return this.props.noActive();
    }
    this.setState({ open: !this.state.open });
    document.addEventListener('click', this._outsideClick);
  }

  render() {
    const {
      title,
      children,
      positionClass,
      wrapClass,
      wrapStyle,
    } = this.props;

    return (
      <div className={wrapClass} style={wrapStyle} >
        <div className="dropdown">
          <div className="dropdown_title" onClick={this.handleOpenDropdown} >
            {title}
          </div>
          {this.state.open &&
          <div className={`dropdown_cnt ${positionClass || ''}`} >

            {children}

          </div>}
        </div>
      </div>
    );
  }

}

WrapperDropdown.propTypes = {
  wrapStyle: PropTypes.object,
  wrapClass: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]),
  positionClass: PropTypes.string,
};

export default WrapperDropdown;
