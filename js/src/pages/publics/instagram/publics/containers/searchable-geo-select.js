import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import WrapperDropdown from 'components/advertika/wrapper-dropdown';



class SearchSelectDropdown extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };

    this.onApply = this.onApply.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onApply(filter) {
    this.geoDropdown.handleCloseDropdown();
    this.props.onChange(filter);
    this.setState({
      search: '',
    });
  }

  onSearch({ target: { value } }) {
    this.setState({
      search: value,
    });
  }

  render() {
    const { items, selectedItem, title} = this.props;
    const { search } = this.state;
    const sortedItems = items.filter(item => item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    return (
      <div className="mb1">
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {title}
        </div>
        <WrapperDropdown
          ref={node => { this.geoDropdown = node; }}
          defaultTitle="DefaultTitle"
          title={items.filter(item => item.id == selectedItem).map(item => (
            <span className="allvam" key={item.name}>
                {item.ico && <i className={`i-geo ${item.ico}`} />}
                {item.ico && ' '}
                <span>
                  {item.name}
                </span>
            </span>
          ))}
        >
          <div className="p1 border-bottom">
            <input
              type="text"
              className="field __block"
              value={search}
              onChange={this.onSearch}
            />
          </div>
          <ul style={{}}>
            {sortedItems.map((item, index) => (
              <li
                key={index}
                onClick={() => this.onApply({ geo: [item.id] })}
                className={cx('allvam', { '__active': selectedItem == item.id })}
              >
                {item.ico && <i className={`i-geo ${item.ico}`} />}
                {item.ico && ' '}
                <span>
                  {item.name}
                </span>
              </li>
            ))}
          </ul>

        </WrapperDropdown>
      </div>
    );
  }

}

export default SearchSelectDropdown;
