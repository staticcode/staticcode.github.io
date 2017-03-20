import React from 'react'
/*https://github.com/eliseumds/react-paginate*/

const Paginator = React.createClass({
  propTypes: {
    max: React.PropTypes.number.isRequired,
    maxVisible: React.PropTypes.number,
    currentPage: React.PropTypes.number,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      maxVisible: 5,
    };
  },

  onClickNext() {
    const page = this.props.currentPage;

    if (page < this.props.max) {
      this.goTo(page + 1);
    }
  },

  onClickPrev() {
    if (this.props.currentPage > 1) {
      this.goTo(this.props.currentPage - 1);
    }
  },

  goTo(page) {
    this.props.onChange(page);
  },

  render() {
    const className = this.props.className || '';
    const { currentPage, maxVisible, max } = this.props;
    let skip = 0;

    if (currentPage > maxVisible - 1 && currentPage < max) {
      skip = currentPage - maxVisible + 1;
    } else if (currentPage === max) {
      skip = currentPage - maxVisible;
    }

    let iterator = Array.apply(null, Array(maxVisible)).map((v, i) => skip + i + 1);

    return (
      <nav className="paginator-widget">
        <ul className={`pagination ${className}`}>
          <li
            className={`__tostart ${currentPage === 1 ? '__na' : ''}`}
            onClick={this.goTo.bind(this, 1)}
          >
            В начало
          </li>
          <li
            className={`__previous ${currentPage === 1 ? '__na' : ''}`}
            onClick={this.onClickPrev}
          >
            &#xf150;
          </li>

          {iterator.map(
            (page) =>
              <li key={page}
                onClick={this.goTo.bind(this, page)}
                className={currentPage === page ? '__na' : ''}
              >
                {page}
              </li>
            )
          }

          <li
            className={`__next ${currentPage === max ? '__na' : ''}`}
            onClick={this.onClickNext}
          >
            &#xf152;
          </li>
          <li
            className={`__tolast ${currentPage === max ? '__na' : ''}`}
            onClick={this.goTo.bind(this, max)}
          >
            В конец
          </li>
        </ul>
        <span className="paginator-widget_page-count">
          {`${currentPage} из ${max} страниц`}
        </span>
      </nav>
    );
  },
});


export default Paginator;
