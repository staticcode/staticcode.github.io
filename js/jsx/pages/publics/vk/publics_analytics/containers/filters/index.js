import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import moment from 'moment';
import * as actions from '../../actions';
import Sticky from '../../../../../../components/react-sticky/';
import Datepicker from '../../../../../../components/advertika/DateRangePicker';
import CheckboxesDropdown from '../../../../../../components/advertika/checkboxes-dropdown';
import SelectDropdown from '../../../../../../components/advertika/select-dropdown';
import Inputs from '../../../../../../components/advertika/double-text-inputV2';


class Filters extends Component {

  static propTypes = {
    name: PropTypes.string,
    filterView: PropTypes.array,
    filterConfig: PropTypes.object,
    changeFilter: PropTypes.func,
    fetchData: PropTypes.func,
    changeSort: PropTypes.func,
    resetFilters: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  componentWillMount() {
    this.applyFilter();
  }

  changeCheckboxesDropdown(typePost, checkedItems) {
    this.props.changeFilter({ [typePost]: checkedItems });
  }

  changeSelectDropdown(select, checkedItems) {
    this.props.changeSort({ [select]: checkedItems }, this.props.filterConfig);
  }

  changeDatepicker(dateStart, dateEnd) {
    this.props.changeFilter({ dateStart, dateEnd });
  }

  changeInputs(involvement, value) {
    this.props.changeFilter({ [involvement]: value });
  }

  applyFilter() {
    this.props.fetchData({ ...this.props.filterConfig, page: 0 });
  }

  render() {
    const { filterView, filterConfig } = this.props;
    return (
      <Sticky
        style={{ position: 'absolute', zIndex: 10 }}
        stickyStyle={{ zIndex: 10, position: 'fixed', top: 0, left: 0, right: 0, minWidth: '1200px' }}
      >
        <div className="[ container ] fhp">
          <div className="fhp_resetfilters" onClick={this.props.resetFilters}>
            Очистить фильтры <i className="ion-close-circled" />
          </div>
          <div className="clearfix mb1 fhp_controls">

            <div className="left col-25">
              <Inputs
                {...filterView.inputs}
                ref="inputs"
                btn
                from={filterConfig.involvement && filterConfig.involvement.from || ''}
                to={filterConfig.involvement && filterConfig.involvement.to || ''}
                parentClass="__title-top __title-bold"
                pressEnter={this.applyFilter}
                onChange={this.changeInputs}
              />
            </div>
            <div className="left col-25">
              <Datepicker
                ref="datepicker"
                opens="center"
                className={cx({ __locked: !window.access })}
                title={filterView.datepicker.title}
                startDate={moment(filterConfig.dateStart, 'DD MM YYYY')}
                endDate={moment(filterConfig.dateEnd, 'DD MM YYYY')}
                setDate={this.changeDatepicker}
                applyDate={this.applyFilter}
              />
            </div>
            <div className="left col-25">
              <CheckboxesDropdown
                {...filterView.checkboxesDropdown}
                checkedItems={filterConfig.typePost}
                onChange={this.changeCheckboxesDropdown}
                applySelected={this.applyFilter}
              />
            </div>
            <div className="left col-25">
              <SelectDropdown
                {...filterView.selectDropdown}
                checkedItem={filterConfig.sort}
                onChange={this.changeSelectDropdown}
              />

            </div>
          </div>
        </div>
      </Sticky>
    );
  }
}

const mapStateToProps = ({ filterView, filterConfig }) => ({
  filterView,
  filterConfig,
});

export default connect(mapStateToProps, actions)(Filters);
