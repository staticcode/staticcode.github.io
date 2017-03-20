import React, { PropTypes } from 'react';

const FreemiumMessage = (props) => (
  <div className="bg-darken-1 p3 mb1">
    <p>Вы используете демонстрационную версию сервиса с ограниченной базой объявлений.</p>
    <p>
      {'Доступно '}

      {props.freemiumCounterVisibility
        ? <b>{props.freeBase}</b>
        : <img src="/images/loading.gif" width="19px" />}

      {' объявлений из '}

      {props.freemiumCounterVisibility
        ? <b>{props.teasercount}</b>
        : <img src="/images/loading.gif" width="19px" /> }

      {' найденых.'}
    </p>

    <p>Для получения полного доступа ко всей базе рекламных объявлений перейдите на платный тариф</p>
    <a className="[ button __success __lg ]" href="/cabinet/info/tarif">Выбрать платный тариф</a>
    {' '}
    {!window.isUsedTrial && <span onClick={() => $.post('/carrot/trial')} className="link">Взять тестовый доступ</span>}
  </div>
);

FreemiumMessage.propTypes = {
  freeBase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  teasercount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  freemiumCounterVisibility: PropTypes.bool,
};

export default FreemiumMessage;
