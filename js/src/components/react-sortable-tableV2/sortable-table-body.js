import React, { PropTypes } from 'react';
import SortableTableRow from './sortable-table-row';

const SortableTableBody = ({ data, columns, selectId, checkSelectedKey }) => {
  const bodies = data.map((item, index) => {
    let selected = false;

    if (selectId && checkSelectedKey) {
      selected = selectId === item[checkSelectedKey];
    }

    return (
      <SortableTableRow
        key={index}
        data={item}
        columns={columns}
        selected={selected}
      />
    );
  });

  return (
    <tbody>
      {bodies}
    </tbody>
  );
};

SortableTableBody.propTypes = {
  selectId: PropTypes.string,
  checkSelectedKey: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  sortings: PropTypes.array.isRequired,
};

module.exports = SortableTableBody;
