import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class SelectDropdown extends Component {
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
      subtitle,
      positionClass,
      wrapClass,
      wrapStyle,
      title,
      tooltip,
    } = this.props;

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
      <li key={index} >
        <label>
          <input
            style={{ position: 'absolute', left: '-9999px' }}
            name={filterName}
            type="radio"
            value={item.id}
            checked={String(item.id) === String(checkedItem)}
            onChange={this.handleChange.bind(null, item.id)}
          />
          <span className={String(item.id) === String(checkedItem) ? 'txt-success' : ''}>
            {item.name}
          </span>
        </label>
      </li>
    );

    const defaultDesign = (
      <div className="pseudo-select">
        <div className="pseudo-select_title txt-success"onClick={this.handleOpenDropdown} >
          {subTitle() || subtitle}
        </div>

        {this.state.open &&
        <div className={`pseudo-select_dd ellipsis ${positionClass || ''}`} >
          <ul className="pseudo-select_list m0">
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

SelectDropdown.propTypes = {
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

export default SelectDropdown;
