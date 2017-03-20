import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';


class SearchSelectDropdown extends Component {
  static propTypes = {
    wrapStyle: PropTypes.object,
    wrapClass: PropTypes.string,
    titleClassName: PropTypes.string,
    select: PropTypes.bool,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.element,
    ]),
    positionClass: PropTypes.string,
  };

  static defaultProps = {
    select: true,
  };

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
      select,
      positionClass,
      titleClassName,
      wrapClass,
      wrapStyle,
    } = this.props;

    const { open } = this.state;

    const renderTitle = () => title &&
      <div className="fhp_title" style={{ marginBottom: 5, fontWeight: 'bold' }}>
        {title}
        {!!tooltip &&
          <i
            className="ion-help-circled txt-primary"
            data-tip={tooltip}
            data-place={tooltipPlace || 'top'}
          />
        }
      </div>;

    const renderListItem = (item, index) => (
      <li key={index} >
        <span className={String(item.id) === String(checkedItem) ? 'txt-success' : ''}>
          {item.name}
        </span>
      </li>
    );

    const renderDropdownHeading = () => (

    );


    return (
      <div className={wrapClass} style={wrapStyle} >
        <div className={cx('dropdown', { '__open': open })} ref={node => this.node = node}>
          <div
            className={cx('dropdown_title', { '__select': select }, titleClassName)}
            onClick={this.handleOpenDropdown}
          >
            {title}
          </div>
          {!!open &&
          <div className={`dropdown_cnt ${positionClass || ''}`} >

            <ul >
              {items.map(renderListItem)}
            </ul>

          </div>}
        </div>
      </div>
    );
  }

}

export default SearchSelectDropdown;
