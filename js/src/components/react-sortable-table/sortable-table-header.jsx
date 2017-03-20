
var React = require("react");

var icons = require("./icons");
var SortIconBoth = icons.SortIconBoth;
var SortIconDesc = icons.SortIconDesc;
var SortIconAsc = icons.SortIconAsc;

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
          className={column.className}/>

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

var SortableTableHeaderItem = React.createClass({
  getDefaultProps: function () {
    return {
      sortable: true
    };
  },

  onClick: function (e) {
    if (this.props.sortable)
      this.props.onClick(this.props.index);
  },

  render: function () {
    var sortIcon;
    if (this.props.sortable) {
      sortIcon = <SortIconBoth style={this.props.iconStyle} />;
      if (this.props.sorting == "desc") {
        sortIcon = <SortIconDesc style={this.props.iconStyle} />;
      } else if (this.props.sorting == "asc") {
        sortIcon = <SortIconAsc style={this.props.iconStyle} />;
      }
    }
    return (
      <th style={this.props.style} onClick={this.onClick} width={this.props.width} className={this.props.className} >
        {this.props.header} {sortIcon} {this.props.tooltip ? <i className="ion-help-circled txt-primary" data-tip={this.props.tooltip} data-place={this.props.tooltipPlace}/> : null}
      </th>
    );
  }
});

module.exports = SortableTableHeader;