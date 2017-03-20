import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class CheckboxesDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.applySelected = this.applySelected.bind(this);
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

  toggleCheckbox(newValue, event) {
    const { target: { checked } } = event;
    const geioItems = this.props.checkedItems;
    this.props.onChange(
      this.props.filterName,
      this.toggleItem(geioItems, newValue, checked)
    );
  }

  toggleItem(geioItems, id, checked) {
    if (Array.isArray(id)) {
      switch (checked) {
        case false:
          return geioItems.filter(item => id.indexOf(item) === -1); // удаляем переданные елементы
        case true:
          return [...geioItems, ...id]; // добавляем переданные елементы
        default :
          return id; // заменяем все переданным массивом
      }
    }

    if (checked && geioItems.indexOf(id) === -1) { // добавляем елемент
      return [...geioItems, id];
    }

    return geioItems.filter(element => element !== id); // удаляем елемент
  }

  applySelected() {
    this.setState({ open: false });
    this.props.applySelected();
  }

  render() {
    if (this.state.items === false) {
      return null;
    }
    const {
      items,
      title,
      tooltip,
      tooltipPlace,
      checkedItems,
      filterName,
      subtitle,
      positionClass,
      wrapClass,
      wrapStyle,
    } = this.props;

    // const renderSubTitle = () => items.filter(c => String(c.id) === String(checkedItems))[0].name;

    const allItemsId = items.map(item => item.id);




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

    const renderSubTitle = () => {
      switch (checkedItems.length) {
        case 0 :
          return false;
        case 1 :
          return items.filter(country => country.id == checkedItems)[0].name;
        default:
          return `Выбрано: ${checkedItems.length}`;
      }
    };

    const listItem = (item, index) => {
      const checked = checkedItems.indexOf(item.id) !== -1;
      return (
        <li key={index} >
          <label>
            <input
              style={{ position: 'absolute', left: '-9999px' }}
              name={filterName}
              type="checkbox"
              checked={checked}
              onChange={this.toggleCheckbox.bind(null, item.id)}
            />
            <div
              className={`jq-checkbox ${checked ? 'checked' : ''}`}
              style={{ display: 'inline-block' }}
            />{' '}
            <span className={checked ? 'txt-success' : ''}>
              {item.name}
            </span>
          </label>
        </li>
      );
    };

    const defaultDesign = (
      <div className="pseudo-select">
        <div
          className={`pseudo-select_title ${renderSubTitle() ? 'txt-success' : ''}`}
          onClick={this.handleOpenDropdown}
        >
          {renderSubTitle() || subtitle}
        </div>

        {this.state.open &&
        <div className={`pseudo-select_dd ellipsis ${positionClass || ''}`} >
          <div className="pseudo-select_cnt-top">
            <span className="link" onClick={this.toggleCheckbox.bind(this, allItemsId)}>Выбрать всё</span> |
            <span className="link" onClick={this.toggleCheckbox.bind(this, [])}> Снять выделение</span>
          </div>
          <ul className="pseudo-select_list">
            {items.map((c, i) => listItem(c, i))}
          </ul>
          <div className="pseudo-select_cnt-bottom">
            <span className="button __primary" onClick={this.applySelected}>
              Применить
            </span>
          </div>
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

CheckboxesDropdown.defaultProps = {
  checkedItems: [],
};

CheckboxesDropdown.propTypes = {
  columns: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  checkedItems: PropTypes.array,
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

export default CheckboxesDropdown;
