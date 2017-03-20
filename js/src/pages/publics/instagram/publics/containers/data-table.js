import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import Public from 'components/ig-public-tpl-v2';
import ReactTooltip from 'components/react-tooltip/react-tooltip';
import * as actions from '../actions';


const mapStateToProps = ({ pageData, selectedIds, filterConfig: { geo } }) => ({
  pageData,
  selectedIds,
  geo,
});

@connect(mapStateToProps, actions)
export default class DataTable extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.geo !== nextProps.geo) {
      return false;
    } else {
      return true;
    }

  }

  handelToggleSelected({ target: { checked } }, piblicId) {
    if (checked) {
      this.props.selectPublic(piblicId);
    } else {
      this.props.deselectPublic(piblicId);
    }
  }

  render() {
    const { pageData: { items }, selectedIds, geo } = this.props;

    return (
      <div className="public-ig_list">
        {items.map((data, i) => (
          <Public
            {...data}
            selectedGeo={geo}
            key={data.public.original_id}
            access={access}
            selected={selectedIds.indexOf(data.public.original_id) > -1}
            toggleSelected={this.handelToggleSelected}
          />
        ))}
        <ReactTooltip place="top" type="light" effect="float" multiline />

      </div>
    );
  }
}
