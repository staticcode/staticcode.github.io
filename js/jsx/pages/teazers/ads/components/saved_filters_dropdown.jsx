import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/';

import WrapperDropdown from '../../../../components/advertika/wrapper-dropdown';

class SavedFiltersDropdown extends Component {
  constructor(props) {
    super(props);
  }

  clearFilter(e) {
    e.stopPropagation();
    this.props.resetFilter();
  }

  loadSavedFilter(id) {
    this.props.loadFilterTemplate(id);
    this.refs.savedFilters.handleCloseDropdown();
  }

  render() {
    const { savedFilters } = this.props;

    const dropdownTitle = () => {
      if (!savedFilters.filters.length) {
        return <span>Нет сохраненных фильтров</span>;
      }
      const selectedFilterTitle = savedFilters.filters.filter(filter => filter.selected);
      if (selectedFilterTitle.length) {
        return (
          <div>
            <div
              className="saved-filters_clear"
              onClick={e => this.clearFilter(e)}
            >
              Очистить
            </div>
            <div
              className="saved-filters_title-selected"
            >
              {selectedFilterTitle[0].title}
            </div>
          </div>
        );
      }
      return <span>Выберите настройки фильтра</span>;
    };

    return (
      <WrapperDropdown
        ref="savedFilters"
        wrapClass={`saved-filters ${savedFilters.filters.length ? '' : '__na'}`}
        positionClass="__ddleft"
        noActive={!savedFilters.filters.length ? () => null : null}
        title={
          dropdownTitle()
        }

        applySelected={this.applyFilter}
      >
        <ul>
        {savedFilters.filters.map((item, i) => (
          <li key={i}>
            <span
              className="saved-filters_filter-name"
              onClick={() => this.loadSavedFilter(item.id)}
            >
              {item.title}
            </span>
            <span
              className="saved-filters_filter-delete ion-close-round"
              onClick={() => this.props.deleteFilter(item.id)}
            />
          </li>
        ))}
        </ul>
      </WrapperDropdown>
    );
  }
}

function mapStateToProps({ savedFilters }) {
  return {
    savedFilters,
  };
}

export default connect(mapStateToProps, actions)(SavedFiltersDropdown);