import React, { PropTypes } from 'react';

const FreemiumMessage = (props) => (
  <div className="bg-darken-1 p3 mb1 center">
    <p>Вы используете демонстрационную версию сервиса с ограниченной базой постов.</p>
    <p>
      {'Доступно '}
      <b>{props.freeBase}</b>
      {' объявлений из '}
      <b>{props.datacount}</b>
      {' найденых.'}
    </p>

    <p>Для получения полного доступа ко всей базе рекламных постов и расширенным возможностям сервиса перейдите на платный тариф.</p>
    <a className="[ button __success __lg ]" href="/cabinet/info/tarif">Выбрать платный тариф</a>
    {' '}
    {!window.isUsedTrial &&
      <span className="link" onClick={() => $.post('/carrot/trial')}>Записаться на презентацию</span>}


  </div>
);

FreemiumMessage.propTypes = {
  freeBase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  datacount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  counterVisibility: PropTypes.bool,
};

export default FreemiumMessage;
