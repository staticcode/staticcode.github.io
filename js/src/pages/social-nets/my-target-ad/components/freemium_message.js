import React from 'react';
const FreemiumMessage = ({ message }) => (
  <div className="no-acces-bg">
    <span>
      {message}
    </span>
    <a className="[ button __success __lg ]" href="/cabinet/info/tarif">
      Выбрать платный тариф
    </a>
  </div>
);

FreemiumMessage.displayName = 'FreemiumMessage';

export default FreemiumMessage;
