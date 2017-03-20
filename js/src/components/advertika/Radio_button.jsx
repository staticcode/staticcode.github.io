import React from 'react';

const RadioButton = ({ onChange, items, checked }) => (
  <div>
    {items.map((item, i) => (
      <label key={i}>
        <input
          style={{ position: 'absolute', left: '-9999px' }}
          name={item.name}
          type="radio"
          checked={checked === item.id}
          onChange={e => onChange(item.id, e)}
        />
          <div
            className={`jq-radio ${checked === item.id ? 'checked' : ''}`}
            style={{ display: 'inline-block', marginRight: 4 }}
          />
          {item.title} {' '}
      </label>
    ))}
  </div>
);

export default RadioButton;
