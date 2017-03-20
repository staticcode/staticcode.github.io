import React from 'react';

const IGTmb = React.createClass({
  render () {
    let data = this.props.data;
    let className = '';
    let trend = '';

    if ((/\d/gi).test(data)) {
      if ((/\+/gi).test(data)) {
        className = 'txt-success';
        trend = 8593;
      } else if ((/\-/gi).test(data)) {
        className = 'txt-danger';
        trend = 8595;
      } else {
        className = 'txt-warning';
        trend = 8596;
      }
    }

    return (
      <span className={`${className} allvam`}>
        {!!trend.length && <span className="h3">{String.fromCharCode(trend)}</span>}
        {data}
      </span>
    );
  },
});

export default IGTmb;
