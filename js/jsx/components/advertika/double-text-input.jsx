import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class DoubleTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from: this.props.from,
      to: this.props.to,
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      from: nextProps.from,
      to: nextProps.to,
    });
  }

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.props.group, this.props.name, {
        from: ReactDOM.findDOMNode(this.refs.from).value,
        to: ReactDOM.findDOMNode(this.refs.to).value,
      });
    }
  }

  handleReset() {
    if (this.props.onChange) {
      this.props.onChange(this.props.group, this.props.name, {
        from: '',
        to: '',
      });
    }
    this.setState({
      from: '',
      to: '',
    });
  }

  handleChange(group, name) {
    const _from = ReactDOM.findDOMNode(this.refs.from).value.replace(/[^0-9.,]+/ig, '');
    const _to = ReactDOM.findDOMNode(this.refs.to).value.replace(/[^0-9.,]+/ig, '');

    if (this.props.onChange) {
      this.props.onChange(group, name, {
        from: _from,
        to: _to,
      });
    }
    this.state.from = _from;
    this.state.to = _to;
    this.forceUpdate();
  }

  handleOnBlur(group, name) {
    const _from = this.state.from;
    const _to = this.state.to;
    if ((_from && _to) && Number(_from.replace(',', '.')) > Number(_to.replace(',', '.')) && _to.length) {
      this.setState({ to: _from });
      if (this.props.onChange) {
        this.props.onChange(group, name, {
          from: _from,
          to: _to,
        });
      }
    }
  }

  handleClick() {
    this.props.pressEnter();
    this.setState({ ShowApplyBtn: false });
  }

  pressEnter(group, name, e) {
    if (e.which === 13) {
      this.handleOnBlur(group, name);
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
              ref="from"
              className="field __sm center"
              type="text"
              value={this.state.from}
              onKeyPress={this.pressEnter.bind(null, this.props.group, this.props.name)}
              onFocus={this.handleOnFocus}
              onChange={this.handleChange.bind(null, this.props.group, this.props.name, 'from')}
              onBlur={this.handleOnBlur.bind(null, this.props.group, this.props.name, 'from')}
              placeholder={ this.props.plfrom || 'от'}
            />
            {' - '}
            <input
              ref="to"
              className="field __sm center"
              type="text"
              value={this.state.to}
              onKeyPress={this.pressEnter.bind(null, this.props.group, this.props.name)}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur.bind(null, this.props.group, this.props.name, 'to')}
              onChange={this.handleChange.bind(null, this.props.group, this.props.name, 'to')}
              placeholder={ this.props.plto || 'до'}
            />
          </div>
          {this.props.btn
            ? <button
              className="button __lg __primary "
              style={{
                position: 'absolute',
                right: '0px',
                zIndex: 1,
                bottom: '0px',
              }}
              onClick={this.handleClick}
            >
              &#10003;
            </button>
            : null}


        </div>
    );
  }
}

DoubleTextInput.propTypes = {
  to: PropTypes.string,
  from: PropTypes.string,
  tooltipText: PropTypes.string,
  btn: PropTypes.bool,
  group: PropTypes.string,
  name: PropTypes.string,
  plto: PropTypes.string,
  plfrom: PropTypes.string,
  className: PropTypes.string,
  ico: PropTypes.string,
  title: PropTypes.string,
  parentClass: PropTypes.string,
  style: PropTypes.string,
  pressEnter: PropTypes.func,
  onChange: PropTypes.func,
};

export default DoubleTextInput;
