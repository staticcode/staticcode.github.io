
var React = require("react");

var SortableTableHeader = require("./sortable-table-header");
var SortableTableBody = require("./sortable-table-body");

var SortableTable = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    columns: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    iconStyle: React.PropTypes.object
  },

  getInitialState() {
    var sortings = this.getDefaultSortings();

    return {
      sortings: sortings,
    };
  },

  getDefaultSortings() {
    return this.props.columns.map(function(column) {
      var sorting = 'both';
      if (column.defaultSorting) {
        var defaultSorting = column.defaultSorting.toLowerCase();

        if (defaultSorting == 'desc') {
          sorting = 'desc';
        } else if (defaultSorting == 'asc') {
          sorting = 'asc';
        }
      }
      return sorting;
    });
  },

  resetState() {
    this.setState({
      sortings: this.getDefaultSortings(),
    });
  },

  sortData(data, sortings) {
    var sortedData = this.props.data;
    for (var i in sortings) {
      var sorting = sortings[i];
      var column = this.props.columns[i];
      var key = this.props.columns[i].key;
      switch (sorting) {
        case 'desc':
          if (column.descSortFunction && typeof(column.descSortFunction) == 'function') {
            sortedData = column.descSortFunction(sortedData, key);
          } else {
            sortedData = this.descSortData(sortedData, key);
          }
          break;
        case 'asc':
          if (column.ascSortFunction && typeof(column.ascSortFunction) == 'function') {
            sortedData = column.ascSortFunction(sortedData, key);
          } else {
            sortedData = this.ascSortData(sortedData, key);
          }
          break;
      }
    }
    return sortedData;
  },

  ascSortData(data, key) {
    return this.sortDataByKey(data, key, function(a, b) {
      if (this.parseFloatable(a) && this.parseFloatable(b)) {
        a = this.parseIfFloat(a);
        b = this.parseIfFloat(b);
      }
      if (a >= b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
    }.bind(this));
  },

  descSortData(data, key) {
    return this.sortDataByKey(data, key, function(a, b) {
      if (this.parseFloatable(a) && this.parseFloatable(b)) {
        a = this.parseIfFloat(a);
        b = this.parseIfFloat(b);
      }
      if (a <= b) {
        return 1;
      } else if (a > b) {
        return -1;
      }
    }.bind(this));
  },

  parseFloatable(value) {
    return (
      typeof(value) === 'string' && (/^\d+$/.test(value) || /^\d+$/.test(value.replace(/[,.%$+-]/g, '')))
      );
  },

  parseIfFloat(value) {
    return parseFloat(value.replace(/,/g, ''));
  },

  sortDataByKey(data, key, fn) {
    var clone = Array.apply(null, data);

    return clone.sort(function (a, b) {
      return fn(a[key], b[key]);
    });
  },

  onStateChange(index, columnKey) {
    var sortings = this.state.sortings.map(function (sorting, i) {
      if (i == index) {
        sorting = this.nextSortingState(sorting);
      } else {
        sorting = 'both';
      }
      return sorting;
    }.bind(this));


    this.setState({ sortings: sortings });
    this.props.onSort(columnKey, this.nextSortingState(this.state.sortings[index]));
  },

  nextSortingState(state) {
    let next;
    switch (state) {
      case 'both':
        next = 'desc';
        break;
      case 'desc':
        next = 'asc';
        break;
      case 'asc':
        next = 'desc';
        break;
    }
    return next;
  },

  /*
  nextSortingState: function (state) {
      var next;
      switch (state) {
          case "both":
              next = "desc";
              break;
          case "desc":
              next = "asc";
              break;
          case "asc":
              next= "both";
              break;
      }
      return next;
  },*/

  render() {
      // var sortedData = this.sortData(this.props.data, this.state.sortings);

    return (
      <table className={this.props.className || 'table'} style={this.props.style} >
        <SortableTableHeader
          columns={this.props.columns}
          sortings={this.state.sortings}
          onStateChange={this.onStateChange}
          iconStyle={this.props.iconStyle}
        />
        <SortableTableBody
          columns={this.props.columns}
          data={this.props.data}
          sortings={this.state.sortings}
        />
      </table>
    );
  }
});

module.exports = SortableTable;