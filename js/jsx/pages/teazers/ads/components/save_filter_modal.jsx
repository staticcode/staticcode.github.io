import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleVisibility, writeFilterTitle, addFilter } from '../actions/index';


class FilterSettingsComponent extends Component {

  constructor(props) {
    super(props);

    // this.handleClickOnOverlay = this.handleClickOnOverlay.bind(this);
    this.handleChangeInputfield = this.handleChangeInputfield.bind(this);
    this.handleSaveFilter = this.handleSaveFilter.bind(this);
  }

  handleClickOnOverlay(e) {
    const isClickInside = this.refs.modal_content.contains(e.target);
    if (!isClickInside) {
      this.props.toggleVisibility({ popupVisibility: !this.props.visibility.popupVisibility });
    }
  }

  handleSaveFilter(title) {
    const value = this.refs.inputfield.value || title;
    const filter = this.props.filterConfig;
    if (value.length) {
      $.post(
        '/teazer/list/savefilter',
        {
          title: value,
          filter,
        },
        data => {
          this.props.addFilter({ title: value, id: data.id });
          this.props.toggleVisibility({ popupVisibility: !this.props.visibility.popupVisibility });
          this.props.writeFilterTitle('');
        },
        'json'
      );
    }
  }

  handleChangeInputfield(e) {
    // console.log(e.target.value);
    this.props.writeFilterTitle(e.target.value);
  }

  render() {
    const { filters, newFilterTitle } = this.props.savedFilters;
    return (
      <div
        className="modal"
        onClick={this.handleClickOnOverlay.bind(this)}
      >
        <style>{`body {overflow: hidden}`}</style>
        <div className="modal_content __xs" ref="modal_content">
          <div className="modal_header">
            <button
              className="close-button"
              onClick={() => this.props.toggleVisibility({ popupVisibility: !this.props.visibility.popupVisibility })}
            >
              <i className="ion-close-round"></i>
            </button>
            <h4 className="modal_title">
              Сохранение настроек фильтра
            </h4>
          </div>
          <div className="modal_body p2">
            <div className="fs_field-layout">
              <div className="fs_field-label">
                Выберите или введите название настроек
              </div>
                <input
                  ref="inputfield"
                  className="field __block"
                  type="text"
                  value={newFilterTitle}
                  onChange={this.handleChangeInputfield}
                  // onSubmit=
                />
                {filters.length
                ? <ul className="fsl">
                  {filters.filter(item => (
                    item.title.toLowerCase().indexOf(newFilterTitle.toLowerCase()) !== -1
                  )).map((item, i) => (
                    <li
                      key={i}
                      onClick={this.handleSaveFilter.bind(this, item.title, item.id)}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
                : <div className="fsl center py2">
                  Сохраненных фильтров нет, пока что...
                </div>}
            </div>

          </div>
          <div className="center modal_footer">
            <button
              onClick={this.handleSaveFilter}
              className="button __success"
            >
              Сохранить
            </button>
            {' '}
            <button
              className="button __default"
              onClick={() => this.props.toggleVisibility({ popupVisibility: !this.props.visibility.popupVisibility })}
            >
                Отменить
            </button>
          </div>
        </div>
      </div>
    );
  }
}


FilterSettingsComponent.propTypes = {
  filterConfig: React.PropTypes.object,
  resetFilter: React.PropTypes.func,
  resetCurrentFilter: React.PropTypes.func,
  writeFilterTitle: React.PropTypes.func,
  toggleVisibility: React.PropTypes.func,
  addFilter: React.PropTypes.func,
  visibility: React.PropTypes.object,
  savedFilters: React.PropTypes.object,
};


function mapStateToProps({ filterConfig, visibility, savedFilters }) {
  return {
    filterConfig,
    visibility,
    savedFilters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleVisibility, writeFilterTitle, addFilter }, dispatch);
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSettingsComponent);
