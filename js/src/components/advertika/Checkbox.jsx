import React from 'react';


export default React.createClass({
  getInitialState() {
    return this.props;
  },
  componentDidMount() {
    // console.log('componentDidMount')
    if (this.props.onChange) {
      this.props.onChange(this.state.name, this.state.checked);
    }
  },
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  },
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate')
    if (this.props.onChange) {
      this.props.onChange(this.state.name, this.state.checked, this);
    }
  },
  handleChange(e) {
    this.setState({
      checked : !this.state.checked,
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.name, this.state.checked);
    };

  },
  render() {
    const design = (design) => {
      switch (design) {
        case 'ion':
          return (
            <div
              className={`ion-checkbox ${this.props.ionClass || ''} ${this.state.checked ? '__checked' : ''}`}
              style={{ display: 'inline-block', marginRight: '4px' }}
            />
          );
        default :
          return (
            <div
              className={`jq-${this.state.inputType || 'checkbox'} ${this.state.checked ? 'checked' : ''}`}
              style={{ display: 'inline-block', marginRight: '4px' }}
            />
          );
      }
    };
    return (
        <label
          className={this.props.className}
          style={this.props.style}
        >
          <input
            style={{ position: 'absolute', left: '-9999px' }}
            name={this.state.name }
            type={this.state.inputType || 'checkbox'}
            checked={this.state.checked || this.props.checked}
            onChange={this.handleChange}
            onClick={this.props.onClick}
          />
          {design(this.props.design)}
          <span>{this.props.children}</span>
        </label>
    );
  },
});

// export default Checkbox
