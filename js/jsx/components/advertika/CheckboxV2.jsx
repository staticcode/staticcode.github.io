import React, { PropTypes } from 'react';
import cx from 'classnames';


const Checkbox = ({
    ionClass,
    checked,
    disabled,
    className,
    style,
    name,
    type,
    design,
    children,
    onChange,
    hidden,
    partChecked }) => {

  const layout = (des) => {
    switch (des) {
      case 'ion':
        return (
          <div
            className={`ion-checkbox ${ionClass || ''} ${checked ? '__checked' : ''}`}
            style={{display: 'inline-block' }}
          />
        );
      default :
        return (
          <div
            className={cx(`jq-${type || 'checkbox'}`, { checked, disabled, 'part-checked': partChecked })}
            style={{ display: 'inline-block', marginRight: 4 }}
          />
        );
    }
  };
  return (
    <label
      className={className}
      style={style}
    >
      <input
        style={{ position: 'absolute', zIndex: '-1', margin: 0, padding: 0, opacity: 0 }}
        name={name}
        type={type || 'checkbox'}
        checked={checked}
        disabled={disabled}
        onChange={e => !hidden && onChange(e)}
      />
      {!hidden && layout(design)}
      <span>{children}</span>
    </label>
  );
};

Checkbox.propTypes = {
  ionClass: PropTypes.string,
  checked: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checkbox;
