import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

const Dropdown = React.createClass({

  propTypes: {
    columns: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    items: PropTypes.object,
    filterName: PropTypes.string,
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
  },

  getInitialState() {
    return {
      open: false,
      dropdown: this.props.items.items || this.props.items.columns,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ dropdown: nextProps.items.items || nextProps.items.columns });
  },

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  },

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ open: false });
      document.removeEventListener('click', this._outsideClick);
    }
  },

  refresh() {
    this.setState({
      dropdown: this.props.items.items || this.props.items.columns,
    });
    if (this.props.items.items) {
      this.props.onChange(this.props.filterName, this.state.dropdown.filter(c => c.checked).map(c => c.id));
    } else {
      this.props.onChange(this.props.filterName, arr.filter(c => c.checked).map(c => c.id));
    }
  },

  handleOpenDropdown() {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
      document.addEventListener('click', this._outsideClick);
    }
  },

  handleShowContinent(item) {
    this.state.dropdown[1].forEach((c, index) => c.open = index == item);
    this.setState({ dropdown: this.state.dropdown });
  },

  handleShowGroup(item) {
    this.state.dropdown.forEach((c, index) => c.open = index == item);
    this.setState({ dropdown: this.state.dropdown });
  },

  handleCheckContinent(column, region) {
    const state = this.state.dropdown;
    if (this.props.type !== 'groups') {
      state[column][region].checked = !state[column][region].checked;
      state[column][region].items.forEach(c => c.checked = state[column][region].checked);
    } else {
      state[region].checked = !state[region].checked;
      state[region].items.forEach(c => c.checked = state[region].checked);
    }

    const arr = [];
    this.eachColumnItems(
      state,
      c => {
        arr.push(c);
      }
    );
    this.setState({ dropdown: state });
    this.props.onChange(this.props.filterName, arr.filter(c => c.checked).map(c => c.id));
  },

  handleToggleItemCategory(category_name, item_id) {
    // console.log(category_name, item_id)
    const state = this.state.dropdown;
    state.forEach(
      c => c.filter(
        c => c.category_name == category_name
      ).forEach(c => c.items[item_id - 1].checked = !c.items[item_id - 1].checked)
    );
    this.setState({ dropdown: state });
  },

  handleChange(action, id) {
    const state = this.state.dropdown;
    if (this.props.items.items) {

      if (this.props.inputType) {

        id = id || state[0].id;
        state.forEach(c => c.checked = c.id == id);

      } else {

        state.forEach(c => c.checked = action(c, id));
      }

      this.setState({ dropdown: state });
      this.props.onChange(this.props.filterName, this.state.dropdown.filter(c => c.checked).map(c => c.id));

    } else {

      if (!id &&  this.props.type !== 'groups') { // чек анчек на группе
        state.forEach(
          c => c.forEach(c => c.checked = action())
        );

      } else if (!id) { // чек анчек на группе
        state.forEach(
          c => c.checked = action()
        );
      }

      const arr = [];
      this.eachColumnItems(
        state,
        c => {
          c.checked = action(c, id);
          arr.push(c);
        }
      );

      this.setState({ dropdown: state });
      this.props.onChange(this.props.filterName, arr.filter(c => c.checked).map(c => c.id));
    }


    if (this.props.selectbox && action({ id: 1 }, 1)) {
      this.applySelected();
    }

  },
  applySelected() {
    this.setState({ open: false });
    this.props.applySelected();
  },
  eachColumnItems(columns, callback) {

    switch (this.props.type) {
      case 'geo':
        return columns[1].forEach(
        c => c.items.forEach(
          callback
        )
      );
      case 'groups':
        return columns.forEach(
        c => c.items.forEach(
          callback
        )
      );
      default:
        return columns.forEach(
        c => c.forEach(
          c => c.items ? c.items.forEach(
            callback
          )
          : null
        )
      );
    }
  },

  render() {

    if (this.state.dropdown === false || this.state.dropdown.length === 0) {
      return null;
    }

    const title = this.props.title &&
      <div className="fhp_title" style={{ marginBottom: 5, fontWeight: 'bold' }}>
        {this.props.title}
        {this.props.items.tooltip &&
          <i
            className="ion-help-circled txt-primary"
            data-tip={this.props.items.tooltip}
            data-place={this.props.tooltipPlace || 'top'}
          />
        }
      </div>;

    const subTitle = () => {
      let items = this.state.dropdown;
      let filteredItems = [];

      if (this.props.type !== 'groups') {
        filteredItems = items.filter(c => c.checked);
      }


      if (this.props.items.columns) {
        const arr = [];
        this.eachColumnItems(
          items,
          c => {
            c.checked ? filteredItems.push(c) : null;
            arr.push(c);
          }
        );
        items = arr;
      }

      const a = filteredItems.length;
      const b = items.length;


      if (a === 0) {
        return;
      }
      if (a > 0 && a < 2) {
        return filteredItems[0].name;
      }
      if (a < b) {
        return `Выбрано: ${a}`;
      } else {
        return `${this.props.subtitle}  (${a})`;
      }
    };

    const items = (item, index, category_name) => {
      const inputType = this.props.inputType || 'checkbox';
      return (
        <li key={index} >
          <label>
            <input
              style={{ position: 'absolute', left: '-9999px' }}
              name={this.props.filterName}
              type={inputType}
              value={item.id}
              checked={item.checked}
              onChange={
                this.props.type == 'multicategoryes'
                ?this.handleToggleItemCategory.bind(this, category_name, item.id)
                :this.handleChange.bind(this, (c, id) => (c.id === id ? !c.checked : c.checked), item.id)
              }
            />
              {!this.props.selectbox &&
                <div
                  className={`jq-${inputType} ${item.checked ? 'checked' : ''}`}
                  style={{ display: 'inline-block', marginRight: 5 }}
                />}
              {item.ico &&
                <span style={{ marginRight: 5 }} className={`i-geo ${item.ico}`} />}
              <span className={item.checked ? 'txt-success' : ''}>
                {item.name}
              </span>
          </label>
        </li>
      );
    };


    const columns = (c, i) =>
      <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 230, marginRight: 20 }} key={i}>
        <ul>
          {c.map((c, j) =>
            <li key={c.category} className={c.category_name}>
              <label>
                <input
                  style={{ position: 'absolute', left: '-9999px' }}
                  name={this.props.filterName}
                  type="checkbox"
                  checked={c.checked}
                  onChange={this.handleCheckContinent.bind(this, i, j)}
                />
                <div
                  className={`jq-checkbox ${c.checked ? 'checked' : ''}`}
                  style={{ display: 'inline-block', marginRight: 5 }}
                />

                <span style={{ cursor: 'pointer ' }}>
                  <strong>{c.category}</strong>
                  <span className="px1">{c.items.filter(c => c.checked).length + ' / '}{c.items.length}</span>
                </span>
              </label>

              <ul style={{ paddingLeft: 20 }}>
                {c.items.map((a, b) => items(a, b, c.category_name))}
              </ul>

            </li>
          )}
        </ul>
      </li>;

    const defaultStructure = () => (
      <ul className={`pseudo-select_list ${this.props.noControls ? 'm0' : null}`}>
        {this.state.dropdown.map((c, i) => (this.props.items.items ? items : columns)(c, i))}
      </ul>
    );
    const geoStructure = () => (
      <ul className="pseudo-select_list  __columns">
        <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 180, marginRight: 0 }} >
          <div className="center">
            <strong>{this.state.dropdown[0][0].category}</strong>
          </div>
          <ul>
            {this.state.dropdown[0].map(c => {
              const popularCountry = [];
              const popularID = c.items.map(c => c.id);

              this.state.dropdown[1].forEach(
                c => c.items.forEach(
                  c => {
                    if (popularID.indexOf(c.id) !== -1) {
                      popularCountry.push(c);
                    }
                  }
                )
              );
              return popularCountry.map((c, i) => items(c, i));
            })}
          </ul>
        </li>
        <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 250, marginRight: 0 }} >
          <div className="center">
            <strong>Континенты</strong>
          </div>
          <ul>
            {this.state.dropdown[1].map((c, index) =>
              <li key={c.category}>
                  <label>
                    <input
                      style={{ position: 'absolute', left: '-9999px' }}
                      name={this.props.filterName}
                      type="checkbox"
                      checked={c.checked || false}
                      onChange={this.handleCheckContinent.bind(this, 1, index)}
                    />
                    <div
                      className={
                        `jq-checkbox ${c.checked && c.items.filter(c => c.checked).length == c.items.length ? 'checked' : c.items.filter(c => c.checked).length ? 'part-checked' : ''}`
                      }
                      style={{ display: 'inline-block', marginRight: 5, position: 'relative' }}
                    />
                  </label>
                <span onClick={ this.handleShowContinent.bind(this, index)} style={{ cursor: 'pointer' }}>
                  <strong className={c.open ? 'txt-success' : ''}>{c.category}</strong>
                  <span className="px1">
                    {`${c.items.filter(c => c.checked).length} / ${c.items.length}`}
                  </span>
                </span>
              </li>
            )}
          </ul>
        </li>

        <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 245, marginRight: 0 }} >

          <div className="txt-success center">
            <strong>
              {this.state.dropdown[1].filter(c => c.open)[0].category}
            </strong>
          </div>

          <ul className="pseudo-select_list" style={{ maxHeight: 280 }}>
            {this.state.dropdown[1].filter(c => c.open).map(c => c.items.map((c, i) => items(c, i)))}
          </ul>
        </li>

      </ul>
    );
    const groupsStructure = () => (
      <ul className="pseudo-select_list  __columns">
        <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 250, marginRight: 0 }} >
          <div className="center">
            <strong>Группы</strong>
          </div>
          <ul>
            {this.state.dropdown.map((c, index) =>
              <li key={c.category}>
                  <label>
                    <input
                      style={{ position: 'absolute', left: '-9999px' }}
                      name={this.props.filterName}
                      type="checkbox"
                      checked={c.checked || false}
                      onChange={this.handleCheckContinent.bind(this, 0, index)}
                    />
                    <div
                      className={
                        `jq-checkbox ${c.checked && c.items.filter(c => c.checked).length == c.items.length ? 'checked' : c.items.filter(c => c.checked).length ? 'part-checked' : ''}`
                      }
                      style={{ display: 'inline-block', marginRight: 5, position: 'relative' }}
                    />
                  </label>
                <span onClick={ this.handleShowGroup.bind(this, index)} style={{ cursor: 'pointer' }}>
                  <strong className={c.open ? 'txt-success' : ''}>{c.category}</strong>
                  <span className="px1">
                    {`${c.items.filter(c => c.checked).length} / ${c.items.length}`}
                  </span>
                </span>
              </li>
            )}
          </ul>
        </li>

        <li style={{ display: 'inline-block', verticalAlign: 'top', minWidth: 245, marginRight: 0 }} >

          <div className="txt-success center">
            <strong>
              {this.state.dropdown.filter(c => c.open)[0].category}
            </strong>
          </div>

          <ul className="pseudo-select_list" style={{ maxHeight: 340 }}>
            {this.state.dropdown.filter(c => c.open).map(c => c.items.map((c, i) => items(c, i)))}
          </ul>
        </li>

      </ul>
    );
    const ddContentStructure = (structure) => {
      switch (structure) {
        case 'geo':
          return geoStructure();
        case 'groups':
          return groupsStructure();
        default:
          return defaultStructure();
      }
    };

    const ddContent = (
      this.state.open &&
        <div
          className={`pseudo-select_dd ellipsis ${this.props.items.positionClass || this.props.positionClass || ''}`}
        >
        {(!this.props.noControls && !this.props.inputType) &&
          <div className="pseudo-select_cnt-top">
            <span className="link" onClick={this.handleChange.bind(this, () => true, false)}>Выбрать всё</span> |
            <span className="link" onClick={this.handleChange.bind(this, () => false, false)}> Снять выделение</span>
          </div>
        }

          {ddContentStructure(this.props.type)}

          <div className="pseudo-select_cnt-bottom">
            {!this.props.noControls &&
              <span className="button __primary" onClick={this.applySelected}>
                Применить
              </span>
            }
          </div>
        </div>
    );

    const selectClass = cx({
      'pseudo-select': true,
      '__open': this.state.open,
      '__disabled': this.props.disabled,
    });

    const defaultDesign = (
      <div className={selectClass}>
        <div
          className={`pseudo-select_title ${subTitle() ? 'txt-success' : ''}`}
          onClick={this.handleOpenDropdown}
        >
          {subTitle() || this.props.subtitle}
        </div>
        { ddContent }
      </div>
    );

    const linkDesign = (
      <div style={{ position: 'relative' }}>
        <div
          className={`link ${subTitle() ? 'txt-success' : ''}`}
          onClick={this.handleOpenDropdown}
        >
          <strong>{this.props.subtitle}</strong>
        </div>
        { ddContent }
      </div>
    );

    const design = (design) => {
      switch (design) {
        case 'link':
          return linkDesign;
        default:
          return defaultDesign;
      }
    };

    return (
      <div className={ this.props.wrapClass } style={this.props.wrapStyle} >
        {title}
        {design(this.props.design)}
      </div>
    );
  },

});


export default Dropdown;
