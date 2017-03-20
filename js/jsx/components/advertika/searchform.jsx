import React from 'react';


class Searchform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      // settings: false,
      Settings: false,
      advSearch: {},

    };

    this.handleShowSettings = this.handleShowSettings.bind(this);
    this.handleAdvChange = this.handleAdvChange.bind(this);
    this.handleAdvBlur = this.handleAdvBlur.bind(this);
    this.handleAdvFocus = this.handleAdvFocus.bind(this);
    this.handleAdvReset = this.handleAdvReset.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOutside = this.handleChangeOutside.bind(this);
  }

  componentDidMount() {
    window.ReactSearchBar = this;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rewritable === true) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChangeOutside(val) {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, val);
    }
    this.setState({ value: val });
  }

  handleShowSettings() {
    this.setState({ Settings: !this.state.Settings });
    this.props.onChange(this.props.name, this.state.Settings ? this.state.value : '');
    this.props.onChange('advSearch', !this.state.Settings ? this.state.advSearch : '');
  }

  handleAdvChange(e) {
    const value = e.target.value;
    const mask = e.target.dataset.mask;
    const regex = new RegExp(`^${mask}${mask}`);

    this.state.advSearch[e.target.name] = mask.length ? value.replace(/\s/g, '').replace(regex, mask) : value;

    if (!value.length) {
      this.state.advSearch[e.target.name] = mask;
    }
    this.forceUpdate();
    this.props.onChange('advSearch', this.state.advSearch);
  }

  handleAdvBlur(e) {
    if (e.target.value.length - 1 <= 0 && e.target.dataset.mask) {
      this.state.advSearch[e.target.name] = '';
      this.forceUpdate();
    }
  }

  handleAdvFocus(e) {
    if (!e.target.value.length) {
      this.state.advSearch[e.target.name] = e.target.dataset.mask;
      this.forceUpdate();
    }
  }

  handleAdvReset(name) {
    this.state.advSearch[name] = '';
    this.forceUpdate();
    this.props.onChange('advSearch', this.state.advSearch);
  }

  handleReset() {
    this.props.onChange(this.props.name, '');
    this.setState(
      { value: '' },
      () => {this.props.onSubmit();}
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit();
  }

  handleChange(e) {
    this.props.onChange(this.props.name, e.target.value);
    this.setState({ value: e.target.value });
  }

  render() {
    const message = this.state.value;
    return (
      <form
        className={`search-form ${this.props.classNames ? this.props.classNames : '[ col-60 mx-auto mb2 ]'}`}
        onSubmit={this.handleSubmit} style={this.props.style}
      >
        <table className="search-form_layout">
          <tbody>
            <tr className="layout-table__row">
              <td className="search-form_layout-input">
                {!this.state.Settings
                  ? <div>
                    <input
                      id={this.props.id || 'serch_string'}
                      className="search-form_input serch_string"
                      placeholder={this.props.placeholder}
                      onChange={this.handleChange}
                      onFocus={this.props.onFocus}
                      value={message}
                      onBlur={this.handleOnBlur}
                      style={this.props.settings ? { paddingRight: 130 } : null}
                      autoComplete={this.props.autoComplete}
                      maxLength="255"
                      type="text"
                    />
                    {this.state.value
                      ? <span
                        className="search-form_reset-search"
                        style={this.props.settings ? { right: 130 } : null}
                        onClick={this.handleReset}
                      >
                        <i className="ion-close-round"></i>
                      </span>
                      : null}

                  </div>

                  : <div className="search-form_adv">

                    {this.props.settings.map(
                      c =>
                        <div
                          className="search-form_adv-field-w relative inline-block"
                          key={c.name}
                          style={{ width: `${100 / this.props.settings.length}%` }}
                        >
                          <input
                            style={{
                              paddingRight: this.state.advSearch[c.name] ? '25px' : '',
                            }}
                            placeholder={c.placeholder}
                            onChange={this.handleAdvChange}
                            name={c.name}
                            key={c.name}
                            data-mask={c.mask}
                            value={this.state.advSearch[c.name]}
                            onBlur={this.handleAdvBlur}
                            onFocus={this.handleAdvFocus}
                            type="text"
                          />
                          {(this.state.advSearch[c.name] ? this.state.advSearch[c.name].length - c.mask.length : false)
                            ? <span
                              className="search-form_reset-search"
                              onClick={this.handleAdvReset.bind(null, c.name)}
                            >
                              <i className="ion-close-round"></i>
                            </span>
                            : null}
                        </div>
                      )}

                  </div>
                }
                {this.props.settings
                  ? <span
                    style={{
                      height: 20,
                      fontSize: 14,
                      fontStyle: 'italic',
                      right: 5,
                    }}
                    className="search-form_reset-search txt-primary"
                    onClick={this.handleShowSettings}
                  >
                    {!this.state.Settings ? 'Точный поиск' : 'Обычный поиск'}
                    {' '}
                    <i
                      className="ion-gear-a"
                      style={{
                        fontSize: 21,
                        verticalAlign: 'middle',
                      }}
                    />
                  </span>
                  : null}
              </td>
              <td className="search-form_layout-button">
                <button className="search-form_button  [ button __primary ]">НАЙТИ</button>
              </td>
            </tr>
            <tr className="layout-table__row">
              <td className="search-form_layout-under __examples" colSpan="2">
                {this.props.children}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}


Searchform.propTypes = {
  rewritable: React.PropTypes.bool,
  children: React.PropTypes.object,
  style: React.PropTypes.object,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  value: React.PropTypes.string,
  autoComplete: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  classNames: React.PropTypes.string,
  settings: React.PropTypes.array,
  onFocus: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
};

Searchform.getDefaultProps = {
  placeholder: 'Найти',
  name: 'inputField',
};

export default Searchform;
