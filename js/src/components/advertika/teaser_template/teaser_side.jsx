import React, { PropTypes } from 'react';
import LinkBox from '../link_box';
import cx from 'classnames';

const TeaserSide = (props) => {
  const {
    id,
    offer,
    lnd,
    plnd,
    indexing,
    geo,
    size,
    format,
    type,
    lifetime,
    img,
    img_name,
    net,
    category,
    hits,
    is_fav,
  } = props;

  return (
    <div className="tzbl_popup_right">
      <table>
        <colgroup>
          <col width="85px" />
          <col />
        </colgroup>
          <tbody>
          {!!offer && !!offer.length &&
            <tr>
              <td>Оффер:</td>
              <td>
              {offer.map((item, i) => (
                <div className="ellipsis" key={i}>
                  &bull;
                  <a
                    data-tip={item.title}
                    href={item.link}
                  >
                  {item.title}
                  </a>
                </div>
                ))
                }
              </td>
            </tr>}

          {!!lnd &&
            <tr>
              <td>Лендинг:</td>
              <td>
                <LinkBox
                  href={lnd.linkIn}
                  title={lnd.title}
                  extHref={lnd.linkOut}
                  className="__sm js-lock-lnd"
                />
              </td>
            </tr>}

          {!!plnd &&
            <tr>
              <td>Прелендинг:</td>
              <td>
                <LinkBox
                  href={plnd.linkIn}
                  title={plnd.title}
                  extHref={plnd.linkOut}
                  className="__sm js-lock-pl"
                />
              </td>
            </tr>}
            {!!indexing &&
            <tr>
              <td data-tip="Период показа объявления">Индексация:</td>
              <td>
                {`${indexing} (${lifetime} дн)`}
              </td>
            </tr>}

            <tr>
              <td>География:</td>
              <td>
              {geo.map(ico => (
                <i className={`i-geo ${ico.code.toLowerCase()}`} data-tip={ico.name} key={ico.code} />
                ))}
              </td>
            </tr>

            <tr>
              <td>
                Размер:
              </td>
              <td>
                {size}
              </td>
            </tr>

            <tr>
              <td>Формат:</td>
              <td>
                {`${format.w}x${format.h}`}
              </td>
            </tr>

            <tr>
              <td>Тип:</td>
              <td>
                {type}
              </td>
            </tr>

            <tr>
              <td>Категория:</td>
              <td>
                {category}
              </td>
            </tr>

            <tr>
              <td>Показов:</td>
              <td>
                {hits}
              </td>
            </tr>

          </tbody>


        </table>

        <div className="button-group-2">
            <button
              className="button __default __sm"
              onClick={() => props.toggleFavorite(is_fav)}
            >
              <i className={is_fav ? 'ion-trash-a' : 'ion-star'} />
              {!is_fav ? ' В избранное' : ' Из избранного' }
            </button>
            <a
              href={`/projects/imgsearch/index?src=${img}`}
              className="button __default __sm"
              data-content="Поиск картинок в Google"
            >
              <i className="ion-ios7-camera" />
              {' Похожие'}
            </a>
            <a
              href={`/teazer/list/loadimg?net_id=${net.id}&name=${img_name}`}
              className="button __default __sm"
            >
              Скачать картинку
            </a>
            <a
              href={`/teazer/show/${id}`}
              className="button __default __sm"
              target="_blank"
            >
              Подробнее
            </a>
        </div>

        <div className="center">
        </div>
    </div>
  );
};

TeaserSide.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // offer: PropTypes.string,
  lnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  plnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  indexing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  is_fav: PropTypes.bool,
  geo: PropTypes.array,
  format: PropTypes.object,
  // category: PropTypes.string,
  hits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  type: PropTypes.string,
};

export default TeaserSide;
