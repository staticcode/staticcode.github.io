import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class DoubleTextInput extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   from: this.props.from,
    //   to: this.props.to,
    // };


    this.handleChange = this.handleChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
  }

  handleChange(event) {
    const _from = this.from.value.replace(/[^0-9.,]+/ig, '');
    const _to = this.to.value.replace(/[^0-9.,]+/ig, '');
    if (this.props.onChange) {
      this.props.onChange(this.props.name, {
        from: _from,
        to: _to,
      }, event
      );
    }
  }

  handleOnBlur(e) {
    const { from: _from, to: _to, onChange, name } = this.props;
    if ((_from && _to) && Number(_from.replace(',', '.')) > Number(_to.replace(',', '.')) && _to.length) {
      if (onChange) {
        onChange(name, {
          from: _from,
          to: _from,
        }, e);
      }
    }
  }

  handleClick() {
    this.props.pressEnter();
  }

  pressEnter(e) {
    if (e.which === 13) {
      this.handleOnBlur(e);
      setTimeout(this.props.pressEnter, 100);
    }
  }

  render() {
    return (
        <div
          className={`f-double-text-input ${this.props.parentClass} ${this.props.btn ? '__controls' : ''}`}
          style={this.props.style || null}
        >
          {(this.props.ico || this.props.title) &&
            <span
              className={`txt-disabled ${this.props.className || ''}`}
              data-tip={this.props.tooltipText}
            >
              {!!this.props.ico && <i className={this.props.ico} />}
              {this.props.title}
            </span>}
          {' '}
          <div className="f-double-text-input_w" >
            <input
              ref={node => {this.from = node;}}
              className="field __sm center"
              type="text"
              value={this.props.from}
              onKeyPress={this.pressEnter}
              onFocus={this.handleOnFocus}
              onChange={e => this.handleChange(e)}
              onBlur={this.handleOnBlur.bind(null, 'from')}
              placeholder={ this.props.plfrom || 'от'}
            />
            {' - '}
            <input
              ref={node => {this.to = node;}}
              className="field __sm center"
              type="text"
              value={this.props.to}
              onKeyPress={this.pressEnter}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur.bind(null, 'to')}
              onChange={e => this.handleChange(e)}
              placeholder={ this.props.plto || 'до'}
            />
          </div>
          {this.props.btn &&
            <button
              className="button __lg __primary "
              style={{
                position: 'absolute',
                right: '0',
                zIndex: 1,
                bottom: 0,
              }}
              onClick={this.handleClick}
            >
              &#10003;
            </button>}


        </div>
    );
  }
}

DoubleTextInput.propTypes = {
  to: PropTypes.string,
  from: PropTypes.string,
  tooltipText: PropTypes.string,
  btn: PropTypes.bool,
  name: PropTypes.string,
  plto: PropTypes.string,
  plfrom: PropTypes.string,
  className: PropTypes.string,
  ico: PropTypes.string,
  title: PropTypes.string,
  parentClass: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  pressEnter: PropTypes.func,
  onChange: PropTypes.func,
};

export default DoubleTextInput;
