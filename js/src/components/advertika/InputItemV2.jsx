import React, { PropTypes } from 'react';

const InputItem = (props) =>
  props.type === 'textarea'
    ? <textarea {...props} value={props.value} onChange={e => props.onChange(e)} />
    : <input type="text" {...props} value={props.value} onChange={e => props.onChange(e)} />;


InputItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  type: PropTypes.string,
};


export default InputItem;
