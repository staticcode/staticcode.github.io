import React, { PropTypes } from 'react';

const CellGeoList = React.createClass({
  getDefaultProps() {
    return {
      limit: 2,
    };
  },

  // handleOpenAnchor(e) {
  //   const win = window.open(
  //     `${$(e.target).closest('tr').children().first().find('a').attr('href')}#${this.props.anchor}`,
  //     '_blank');
  //   win.focus();
  // },

  render () {
    const { data, limit, anchor, anchorLink } = this.props;
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
        {data.slice(0, limit).map((item, i) => listItem(item, i))}
        {(data.length > limit) &&
          <a
            // onClick={this.handleOpenAnchor}
            // style={{ cursor: 'pointer' }}
            // className="txt-primary"
            target="_blank"
            href={`${anchorLink}#${anchor}`}
            rel="nofollow noopener"
          >
            еще страны
          </a>
        }
      </ul>
    );
  }
});

export default CellGeoList;
