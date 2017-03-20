import React from 'react';

class Searchform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }


  handleChange(e) {
    const value = e.target.value;
    const mask = e.target.dataset.mask;
    const regex = new RegExp(`^${mask}${mask}`);
    const filterName = e.target.name;

    const newValue = mask ? value.replace(/\s/g, '').replace(regex, mask) : value;

    // if (!value.length) {
    //   this.state.advSearch[e.target.name] = mask;
    // }
    // this.forceUpdate();
    this.props.onChange({ [filterName]: newValue });
  }

  handleBlur(e) {
    const filterName = e.target.name;
    if (e.target.value.length - 1 <= 0 && e.target.dataset.mask) {
      this.props.onChange({ [filterName]: '' });
    }
  }

  handleFocus(e) {
    const filterName = e.target.name;
    const mask = e.target.dataset.mask;
    if (!e.target.value.length) {
      this.props.onChange({ [filterName]: mask });
    }
  }

  handleReset(filterName) {
    this.props.onChange({ [filterName]: undefined });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const { values, classNames, style, inputs } = this.props;
    const renderInput = (inputItem, index, inputsArr) => (
      <div
        key={index}
        className="relative inline-block"
        style={{ width: `${100 / inputsArr.length}%` }}
      >
        <input
          id={inputItem.id}
          className="search-form_input"
          style={values[inputItem.name] ? {} : { padding: '10px' } }
          value={values[inputItem.name] || ''}
          name={inputItem.name}
          data-mask={inputItem.mask}
          placeholder={inputItem.placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleOnBlur}
          autoComplete={inputItem.autoComplete || 'off'}
          maxLength="255"
          type="text"
        />
        {!!values[inputItem.name] &&
          <span
            className="search-form_reset-search"
            onClick={() => this.handleReset(inputItem.name)}
          >
            <i className="ion-close-round"></i>
          </span>}
      </div>
    );

    return (
      <form
        className={`search-form ${classNames}`}
        onSubmit={this.handleSubmit}
        style={style}
      >
        <table className="search-form_layout">
          <tbody>
            <tr className="layout-table__row">
              <td className="search-form_layout-input">
                {inputs.map(renderInput)}
              </td>
              <td className="search-form_layout-button">
                <button className="search-form_button  [ button __primary ]">
                  НАЙТИ
                </button>
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

Searchform.defaultProps = {
  autoComplete: 'off',
  placeholder: 'Найти',
  value: "",
  name: 'inputField',
  classNames: '[ col-60 mx-auto mb2 ]',
};

export default Searchform;
