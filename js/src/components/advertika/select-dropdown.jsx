import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class SelectDropdown extends Component {
  static propTypes = {
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    checkedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.array,
    wrapStyle: PropTypes.object,
    filterName: PropTypes.string,
    wrapClass: PropTypes.string,
    design: PropTypes.string,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    noControls: PropTypes.bool,
    tooltipPlace: PropTypes.string,
    inputType: PropTypes.string,
    positionClass: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    applySelected: PropTypes.func,
  };

  static defaultProps = {
    select: true,
    title: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleOpenDropdown() {
    this.setState({ open: !this.state.open });
    document.addEventListener('click', this._outsideClick);
  }

  handleChange(id) {
    this.props.onChange(this.props.filterName, id);
    this.setState({ open: !this.state.open });
  }


  render() {
    const {
      items,
      checkedItem,
      filterName,
      titleClassName,
      select,
      subtitle,
      positionClass,
      wrapClass,
      wrapStyle,
      title,
      tooltip,
    } = this.props;

    const { open } = this.state;

    const renderTitle = title &&
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

    const subTitle = () => items.filter(c => String(c.id) === String(checkedItem))[0].name;

    const listItem = (item, index) => (
      <li
        key={index}
        onClick={this.handleChange.bind(null, item.id)}
        className={String(item.id) === String(checkedItem) ? '__active' : ''}
      >
        <span >
          {item.name}
        </span>

      </li>
    );

    const defaultDesign = (
      <div className={cx('dropdown', { '__open': open })}>
        <div
          className={cx('dropdown_title', { '__select': select }, titleClassName)}
          onClick={this.handleOpenDropdown}
        >
          {subTitle() || subtitle}
        </div>

        {open &&
        <div className={`dropdown_cnt ellipsis ${positionClass || ''}`} >
          <ul>
            {items.map((c, i) => listItem(c, i))}
          </ul>
        </div>}

      </div>
    );

    return (
      <div className={wrapClass} style={wrapStyle} >
        {renderTitle}
        {defaultDesign}
      </div>
    );
  }

}

export default SelectDropdown;
