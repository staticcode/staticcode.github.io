import React, { PropTypes } from 'react';

const InputItem = (props) => (
  <input
    type="text"
    {...props}
    value={props.value}
    onChange={e => props.onChange(e)}
  />
);

InputItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};


export default InputItem;
