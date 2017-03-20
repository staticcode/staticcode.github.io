import React, { PropTypes } from 'react';
import { numberWithSpaces } from './helpers';

const CellTrend = (props) => {
  const { diffUser, countUser } = props.data;
  let className = 'txt-success';
  let trend = '';

  if (diffUser != 0) {
    if ((/\-/gi).test(diffUser)) {
      className = 'txt-danger';
    } else {
      trend = '+';
    }
  }

  return (
    <span>
      {numberWithSpaces(countUser)}
      {!!props.data.diffUser &&
      <div className={className}>
        {` (${trend}${numberWithSpaces(diffUser)})`}
      </div>}
    </span>

  );
};

CellTrend.propTypes = {
  data: PropTypes.object,
};

export default CellTrend;
