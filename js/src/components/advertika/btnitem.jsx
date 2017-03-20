import React, { PropTypes } from 'react';

const Btnitem = props => (
  <button
    { ...props }
    className={`button ${props.className}`}
  >
    {props.children}
  </button>
);

Btnitem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
};

export default Btnitem;
