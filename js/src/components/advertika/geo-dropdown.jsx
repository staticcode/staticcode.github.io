import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class GeoDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      visibleGroup: 0,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.applySelected = this.applySelected.bind(this);
    this.toggleCountry = this.toggleCountry.bind(this);
    this.handleShowContinent = this.handleShowContinent.bind(this);
    this.toggleCheckedContinent = this.toggleCheckedContinent.bind(this);
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
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
      document.addEventListener('click', this._outsideClick);
    }
  }

  handleShowContinent(index) {
    this.setState({ visibleGroup: index });
  }

  applySelected() {
    this.setState({ open: false });
    this.props.applySelected();
  }

  toggleGeoItem(geioItems, id, checked) {
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

  toggleCountry(newValue, event) {
    const { target: { checked } } = event;
    const geioItems = this.props.checkedItems;
    this.props.onChange(
      this.props.filterName,
      this.toggleGeoItem(geioItems, newValue, checked)
    );
  }

  toggleCheckedContinent(continentItemsIds, event) {
    const { target: { checked } } = event;
    const geioItems = this.props.checkedItems;
    this.props.onChange(
      this.props.filterName,
      this.toggleGeoItem(geioItems, continentItemsIds[checked ? 0 : 1], checked)
    );
  }

  render() {

    if (this.props.columns === false) {
      return null;
    }

    const {
      checkedItems,
      title,
      tooltip,
      tooltipPlace,
      filterName,
      positionClass,
      columns,
      wrapClass,
      wrapStyle,
      subtitle,
    } = this.props;

    const allItems = columns[1]
                        .map(column => column.items)
                        .map(continent => continent.map(country => country))
                        .reduce((a, b) => [...a, ...b]);
    const allItemsId = allItems.map(country => country.id);


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
          return allItems.filter(country => country.id == checkedItems)[0].name;
        default:
          return `Выбрано: ${checkedItems.length}`;
      }
    };

    const renderCountry = (item, index) => {
      const checked = checkedItems.indexOf(String(item.id)) !== -1;
      return (
        <li key={index} >
          <label>
            <input
              style={{ position: 'absolute', left: '-9999px' }}
              name={filterName}
              type="checkbox"
              checked={checked}
              onChange={this.toggleCountry.bind(null, item.id)}
            />
            <div
              className={`jq-checkbox ${checked ? 'checked' : ''}`}
              style={{ display: 'inline-block' }}
            />{' '}
            <span style={{ marginRight: 5 }} className={`i-geo ${item.ico}`} />
            <span className={checked ? 'txt-success' : ''}>
              {item.name}
            </span>
          </label>
        </li>
      );
    };

    const renderContinent = (continent, index) => {
      const { category, items } = continent;
      const checkedCountriesId = items
                                .filter(country => checkedItems.indexOf(country.id) !== -1)
                                .map(country => country.id);
      const uncheckedCountriesId = items
                                .filter(country => checkedItems.indexOf(country.id) === -1)
                                .map(country => country.id);

      const countCheckedIds = checkedCountriesId.length;
      const isAllItemsChecked = countCheckedIds === items.length;
      const checkedClass = () => {
        if (isAllItemsChecked) {
          return 'checked';
        } else if (countCheckedIds) {
          return 'part-checked';
        }
        return '';
      };

      return (
        <li key={category}>
            <label>
              <input
                style={{ position: 'absolute', left: '-9999px' }}
                type="checkbox"
                checked={isAllItemsChecked}
                onChange={this.toggleCheckedContinent.bind(this, [uncheckedCountriesId, checkedCountriesId])}
              />
              <div
                className={`jq-checkbox ${checkedClass()}`}
                style={{ display: 'inline-block', position: 'relative' }}
              />{' '}
            </label>
          <span onClick={ this.handleShowContinent.bind(this, index)} style={{ cursor: 'pointer' }}>
            <strong className={index === this.state.visibleGroup ? 'txt-success' : ''}>
              {category}
            </strong>
            <span className="px1">
              {items.filter(country => checkedItems.indexOf(country.id) !== -1).length}
              {' / '}
              {items.length}
            </span>
          </span>
        </li>
      );
    };


    const renderDropdownContent = (
      this.state.open &&
        <div className={`pseudo-select_dd ellipsis ${positionClass || ''}`} >

          <div className="pseudo-select_cnt-top">
            <span className="link" onClick={this.toggleCountry.bind(this, allItemsId)}>Выбрать всё</span> |
            <span className="link" onClick={this.toggleCountry.bind(this, [])}> Снять выделение</span>
          </div>


          <ul className="pseudo-select_list  __columns">

            <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 180, marginRight: 0 }} >
              <div className="center">
                <strong>{columns[0][0].category}</strong>
              </div>
              <ul>
                {columns[0].map(column => column.items.map((country, i) => renderCountry(country, i)))}
              </ul>
            </li>

            <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 250, marginRight: 0 }} >
              <div className="center">
                <strong>Континенты</strong>
              </div>
              <ul>
                {columns[1].map((continent, index) => renderContinent(continent, index))}
              </ul>
            </li>

            <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 245, marginRight: 0 }} >

              <div className="txt-success center">
                <strong>
                  {columns[1].filter((continent, i) => i === this.state.visibleGroup)[0].category}
                </strong>
              </div>

              <ul className="pseudo-select_list m0" style={{ maxHeight: 280 }}>
                {columns[1]
                  .filter((continent, i) => i === this.state.visibleGroup)
                  .map(c => c.items.map((country, i) => renderCountry(country, i)))}
              </ul>

            </li>

          </ul>

          <div className="pseudo-select_cnt-bottom">
            <span className="button __primary" onClick={this.applySelected}>
              Применить
            </span>
          </div>
        </div>
    );


    const selectClass = cx({
      'pseudo-select': true,
      '__open': this.state.open,
      '__disabled': this.props.disabled,
    });

    return (
      <div className={wrapClass} style={wrapStyle} >
        {renderTitle}
        <div className={selectClass}>
          <div
            className={`pseudo-select_title ${renderSubTitle() ? 'txt-success' : ''}`}
            onClick={this.handleOpenDropdown}
          >
            {renderSubTitle() || subtitle}
          </div>
          {renderDropdownContent}
        </div>

      </div>
    );
  }

}

GeoDropdown.defaultProps = {
  checkedItems: [],
};

GeoDropdown.propTypes = {
  columns: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  items: PropTypes.object,
  filterName: PropTypes.string,
  tooltip: PropTypes.string,
  design: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  noControls: PropTypes.bool,
  tooltipPlace: PropTypes.string,
  inputType: PropTypes.string,
  positionClass: PropTypes.string,
  wrapStyle: PropTypes.string,
  wrapClass: PropTypes.string,
  checkedItems: PropTypes.array,
  type: PropTypes.string,
  onChange: PropTypes.func,
  applySelected: PropTypes.func,
  disabled: PropTypes.bool,
};

export default GeoDropdown;
