import React, { PropTypes } from 'react';

const PriceVK = (props) => {
  const listItems = (item) => (
    <li key={item}>
      <span
        className={`i-${item}-exchange`}
        style={{ verticalAlign: 'middle', marginRight: 5 }}
      />
      {props.data[item]}
    </li>
  );

  return (
    <ul>
    {Object.keys(props.data).length
      ? Object.keys(props.data).map(c => listItems(c))
      : <li className="center">{props.txt || 'нет на биржах'}</li>
    }
    </ul>
  );
};

PriceVK.propTypes = {
  data: PropTypes.object,
  txt: PropTypes.string,
};

PriceVK.defaultProps = {
  limit: 2,
};

export default PriceVK;
