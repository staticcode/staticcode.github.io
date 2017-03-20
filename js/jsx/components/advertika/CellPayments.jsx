import React, { PropTypes } from 'react';

const CellPayments = ({ data, cellTooltip }) => {
  const tooltip = () => (
    <i className="ion-help-circled txt-primary" data-tip={cellTooltip} />
  );

  if (!data) {
    return null;
  }

  return (
    <span>
      {data.price}{' '}{data.currency || tooltip()}
    </span>
  );
};

CellPayments.propTypes = {
  data: PropTypes.object,
  cellTooltip: PropTypes.string,
};

export default CellPayments;
