import React from 'react';



  // округляет number, decPlaces - количество знаков после запятой (1344489 = 1.3m)
export const abbrNum = (number, decPlaces) => {
  decPlaces = Math.pow(10, decPlaces);
  const abbrev = ['k', 'm', 'b', 't'];
  for (var i = abbrev.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round(number * decPlaces / size) / decPlaces;
      if ((number === 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }
  return number;
};

  // вставляет пробелы после каждой 3-ей цыфры (1344489 = 1 344 489)
  // x - число которое нужно преобразовать
  // separator - разделитель, по умолчанию - пробел
export const numberWithSpaces = (x, separator = ' ') => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // Круглый прелоадер.
  // height - высота блока в котором он отображается,
  // size - размер отображемого изображения прелоадера.
export const circlePreloader = (height = 100, size = 80, width = 'initial') => (
  <div style={{
    height,
    width,
    background: 'url(/images/loading.gif) center center no-repeat',
    backgroundSize: `${size}px ${size}px`,
  }}
  />
);

  //http://www.vanchester.ru/collections/code/php/skript-skloneniya-chislitelnyh-PHP-i-JavaScript
export const declOfNum = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const flatLinePreloader = () => (
  <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
    <div className="indeterminate"></div>
  </div>
);
