import React, { PropTypes } from 'react';

const SortableTableRow = ({ columns, data, selected }) => {
  const tds = columns.map((item, index) => {
    let value = data[item.key];
    if (item.render) {
      value = item.render(value, data);
    }
    return (
      <td key={index} style={item.dataStyle} {...(item.dataProps || {})} >
        {value}
      </td>
    );
  });

  return (<tr className={ selected ? '__row-selected' : ''}>{tds}</tr>);
};


SortableTableRow.displayName = 'SortableTableRow';
SortableTableRow.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default SortableTableRow;
