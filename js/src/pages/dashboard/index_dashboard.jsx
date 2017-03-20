import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import ReactTooltip from '../../components/react-tooltip/react-tooltip';
import Searchform from '../../components/advertika/searchform';

import DashboardPlates from './components/dashboard-plates';
import DashboardDropdown from './components/dashboard_dropdown';

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = { ...DASHBOARDPLATES(), term: '' };

    this.applyFilter = this.applyFilter.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this._outsideClick = this._outsideClick.bind(this);
    this.handleOnInputFocus = this.handleOnInputFocus.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this._outsideClick.bind(this));
  }

  _outsideClick(e) {
    if (this.state.dropdownVisible) {
      const isDashboardDropdown = ReactDOM.findDOMNode(this.refs.DashboardDropdown).contains(e.target);
      const isSearchform = ReactDOM.findDOMNode(this.refs.Searchform).contains(e.target);
      if (!isDashboardDropdown && !isSearchform) {
        this.setState({ dropdownVisible: false });
      }
    }
  }

  applyFilter() {
    const plates = this.state.plates;

    if (!this.state.term) {
      plates.forEach(
        item => {
          item.count = '';
          item.inProcess = false;
        }
      );
      this.forceUpdate();
      return;
    }


    this.state.dropdownVisible = false;

    plates.forEach(
      item => {
        item.inProcess = item.search;
      }
    );

    this.forceUpdate();

    plates.forEach(
      item => {
        $.getJSON('/dashboard/plate/count', { search: this.state.term, type: item.type }, result => {
          if (item.search) {
            plates[item.type - 1].count = result.count;
            plates[item.type - 1].inProcess = false;
            this.forceUpdate();
          }
        });
      }
    );
  }

  handleOnInputFocus() {
    if (this.state.term && !this.state.dropdownVisible) {
      this.setState({ dropdownVisible: true });
    }
  }

  changeFilter(name, term) {
    this.state.term = term;
    this.state.dropdownVisible = term;
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Searchform
          ref="Searchform"
          classNames="mb1"
          placeholder="Введите ключевое слово или фразу"
          onFocus={this.handleOnInputFocus}
          onChange={this.changeFilter}
          onSubmit={this.applyFilter}
          value={this.props.inputField}
          autoComplete="off"
        />

        {this.state.dropdownVisible
          ? <DashboardDropdown {...this.state} ref="DashboardDropdown" />
          : null}


        <div className="container __md">
          <DashboardPlates
            data={this.state.plates}
            term={this.state.term}
            columns={3}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
