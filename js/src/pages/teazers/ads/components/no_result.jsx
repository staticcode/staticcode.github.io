import React, { Component, PropTypes } from 'react';

class NoResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: props.search,
    };
  }

  render() {
    const { search } = this.state;
    return (
      <div className="a-left p4">
        <div className="py2" style={{ fontSize: '70px' }}>
          :(
        </div>
        <div className="fz16 mb3">
          Мы ничего не нашли по запросу
          <strong>
            {search !== '' ? ` "${search}"` : null}
          </strong>
          , хотя и старались!!
        </div>
        <p>
          Советы для поиска<br />
          Проверьте, нет ли опечаток<br />
          <span className="corect-line">
            бу<b className="txt-danger">лз</b>{'в ⟶ '}
            <b className="txt-primary">блуза</b><br />
          </span>
          Загрузите ранее сохранённые настройки<br />
          Измените или сбросьте настройки фильтра
        </p>
        <img src="/images/blue_arrow_back_horizontal.png" />
      </div>
    );
  }
}

NoResult.propTypes = {
  search: PropTypes.string,
};

export default NoResult;
