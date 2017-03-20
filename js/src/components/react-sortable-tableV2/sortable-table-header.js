import React from 'react';
import SortableTableHeaderItem from './sortable-table-headeritem';


var SortableTableHeader = React.createClass({
  propTypes: {
    columns: React.PropTypes.array.isRequired,
    sortings: React.PropTypes.array.isRequired,
    onStateChange: React.PropTypes.func,
    iconStyle: React.PropTypes.object
  },

  onClick: function (index, columnKey) {
    this.props.onStateChange(index, columnKey);
  },

  render: function () {
    var headers = this.props.columns.map(function (column, index) {
      var sorting = this.props.sortings[index];
      return (
        <SortableTableHeaderItem
          sortable={column.sortable}
          tooltip={column.tooltip}
          tooltipPlace={column.tooltipPlace}
          key={index}
          index={index}
          header={column.header}
          sorting={sorting}
          onClick={this.onClick.bind(this, index, column.key)}
          width={column.width}
          iconStyle={this.props.iconStyle}
          style={column.headerStyle}
          className={column.className}
        />

      );
    }.bind(this));

    return (
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
    );
  }
});


module.exports = SortableTableHeader;
