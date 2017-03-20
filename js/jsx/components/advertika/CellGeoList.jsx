import React, { PropTypes } from 'react';

const CellGeoList = React.createClass({
  getDefaultProps() {
    return {
      limit: 2
    };
  },

  handleOpenAnchor(e) {
    const win = window.open(
      `${$(e.target).closest('tr').children().first().find('a').attr('href')}#${this.props.anchor}`,
      '_blank');
    win.focus();
  },

  render () {

    const listItem = item =>
          <li key={item.code} >
            <span
              className={`i-geo  ${item.code.toLowerCase()}`}
              style={{ verticalAlign: 'middle', marginRight: 5 }}
              data-tip={item.title}
            />

            {` - ${item.percent} %`}
          </li>;

    return (
      <ul>
        {this.props.data.slice(0, this.props.limit).map((item, i)=>listItem(item, i))}
        {(this.props.data.length > this.props.limit) &&
          <div
            onClick={this.handleOpenAnchor}
            style={{ cursor: 'pointer' }}
            className="txt-primary"
          >
            еще страны
          </div>
        }
      </ul>
    )
  }
})

export default CellGeoList;
