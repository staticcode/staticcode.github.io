import React from 'react'


const RadioButton = React.createClass({
  getInitialState() {
    return {list:this.props.list};
  },
  componentWillReceiveProps(nextProps) {

    if (this.state.list[0].checked != nextProps.list[0].checked) {
      this.setState({list:nextProps.list});
      var checked ;
      nextProps.list.forEach((c,index)=>{if(c.checked)checked = index});
      this.props.onChange(this.state.list[0].name,checked);
    };

  },
  componentDidUpdate(prevProps, prevState) {

  },
  handleChange(name,i) {
    this.props.list.forEach((c,index)=>{c.checked = index == i})
    this.setState({
      list:this.props.list
    });
    this.props.onChange(name,i)

  },
  render() {
    let design = (element) => {
      switch (element.design) {
          case 'ion': return <div
                className={`ion-checkbox ${element.ionClass || ''} ${element.checked ? '__checked' : ''}`}
                style={{display: 'inline-block', marginRight: 4, }}/>
          default : return <div
                    className={`jq-radio ${element.checked ? 'checked' : ''}`}
                    style={{display: 'inline-block', marginRight: 4}}/>
        }
    }

    const radioList = this.state.list.map((c, i) => (
      <label key={i}>
        <input
          style={{position: 'absolute', left: '-9999px'}}
          name={c.name}
          type="radio"
          checked={c.checked}
          onChange={this.handleChange.bind(this,c.name,i)}
        />
          {design(c)}
          {c.title} {' '}
      </label>
    ));

    return (<div>{radioList}</div>)

  }
})

export default RadioButton