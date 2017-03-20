import React, { PropTypes } from 'react';

import cx from 'classnames';


const SortableTableHeaderItem = ({
  style, width, className, header, tooltip, tooltipPlace, sortable, onClick, index, sorting,
}) => {
  const handleClick = () => {
    if (sortable) {
      onClick(index);
    }
  };

  let sortIcon;
  if (sortable) {
    sortIcon = '__sort-both';
    if (sorting === 'desc') {
      sortIcon = '__sort-desc';
    } else if (sorting === 'asc') {
      sortIcon = '__sort-asc';
    }
  }

  return (
    <th
      width={width}
      style={{ ...(sortable ? { cursor: 'pointer' } : {}), ...style }}
      className={cx(className, sortIcon)}
      onClick={handleClick}
    >
      {header}
      {!!tooltip && ' '}
      {!!tooltip &&
        <i
          className="ion-help-circled txt-primary"
          data-tip={tooltip}
          data-place={tooltipPlace}
        />}
    </th>
  );
};

SortableTableHeaderItem.defaultProps = {
  sortable: true,
};

SortableTableHeaderItem.propTypes = {
  style: PropTypes.object,
  width: PropTypes.string,
  tooltipPlace: PropTypes.string,
  className: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tooltip: PropTypes.string,
  sortable: PropTypes.bool,
  onClick: PropTypes.func,
  index: PropTypes.number,
  sorting: PropTypes.string,
};

export default SortableTableHeaderItem;
