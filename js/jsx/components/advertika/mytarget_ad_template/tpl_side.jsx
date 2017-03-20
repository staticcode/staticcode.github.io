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
    device,
    imgInfo,
    pl,
    sex,
    typeAd,
    os,
    img,
    imgFull,
    img_name,
    net,
    category,
    hits,
    is_fav,
    fullCard,
    classNames,
    colWidth,
  } = props;

  const deviceIcon = { 2: 'i-tablet', 1: 'i-phone' };
  const sexClass = { 2: 'ion-male', 1: 'ion-female' };
  return (
    <div className={!fullCard ? 'mini-card-tpl' : classNames }>
      <table>
        <colgroup>
          <col width={colWidth ? colWidth : '100px'} />
          <col />
        </colgroup>
          <tbody>
          {!!lnd &&
            <tr>
              <td>Лендинг:</td>
              <td>
                <LinkBox
                  href={lnd.linkIn}
                  title={lnd.title}
                  extHref={lnd.linkOut}
                  className={cx({__sm: !fullCard})}
                />
              </td>
            </tr>}

          {!!pl &&
            <tr>
              <td>Площадка:</td>
              <td>
                {pl.map((plItem, i) => (
                  <i
                    className={`i-tn ${plItem.name.toLowerCase()}`}
                    key={plItem.name}
                    data-tip={plItem.title}
                    style={{ marginRight: '4px' }}
                  />
                ))}
              </td>
            </tr>}
            {!!indexing &&
            <tr>
              <td>
                Индексация:
              </td>
              <td>
                {`${indexing} (${lifetime} дн)`}
              </td>
            </tr>}
            {!!sex &&
            <tr>
              <td>
                Демография:
              </td>
              <td>
                {Object.keys(sex.age).map((sexType, i) => (
                  sexType !== '0' &&
                  <div key={i}>
                    <div className={`size-21 ${sexClass[sexType]}`} />
                    {' '}
                    {sex.age[sexType]}
                  </div>

                  ))}
              </td>
            </tr>}
            {geo &&
            <tr>
              <td>География:</td>
              <td>
              {geo.map(ico => (
                <i className={`i-geo ${ico.code.toLowerCase()}`} data-tip={ico.name} key={ico.code} />
                ))}
              </td>
            </tr>}
            {(!!os || !!device ) &&
            <tr>
              <td>
                Устройство:
              </td>
              <td>
                {os.map((osTipe, i) => (
                  <i className={`i-os ${osTipe.toLowerCase()}`} data-tip={osTipe} key={i} />
                ))}
                {device &&
                  device.map((deviceItem, i) => (
                    <i
                      key={i}
                      className={deviceIcon[deviceItem.id]}
                      data-tip={deviceItem.title}
                    />
                  ))}
              </td>
            </tr>}
            {!!imgInfo &&
            <tr>
              <td>
                Изображение:
              </td>
              <td>
                {imgInfo.resol}
                {` - ${imgInfo.size} кб`}
              </td>
            </tr>}
            {!!typeAd &&
            <tr>
              <td>
                Тип рекламы:
              </td>
              <td>
                {typeAd}
              </td>
            </tr>}
          </tbody>


        </table>

        <div className={cx({ 'button-group-2': !classNames })}>
            <a
              href={imgFull}
              className="button __default __sm"
              target="_blank"
              data-effect="solid"
              data-offset="{'top': -10}"
              data-delay-show="1000"
              data-tip="Нажмите, чтобы увидеть оригинал изображения данного объявления. <br> Для повышения скорости загрузки сервис отображает миниатюры изображений"
            >
              Оригинал
            </a>
            <a
              href={`/zip/mtm?method=zip&ads=${id}`}
              className="button __default __sm"
              data-effect="solid"
              data-offset="{'top': -10}"
              data-delay-show="1000"
              data-tip="Нажмите, чтобы сохранить данное объявление в виде архива"
            >
              Экспорт в ZIP
            </a>
            <a
              href={`/projects/imgsearch/index?src=${imgFull}`}
              className="button __default __sm"
              target="_blank"
              data-effect="solid"
              data-offset="{'top': -10}"
              data-delay-show="1000"
              data-tip="Нажмите для поиска похожих изображений с помощью Google"
            >
              <i className="ion-ios7-camera" />
              {` Похожие`}
            </a>
          {!fullCard &&
            <a
              href={`/mytarget/mobile/${id}`}
              className="button __default __sm"
              target="_blank"
              data-effect="solid"
              data-offset="{'top': -10}"
              data-delay-show="1000"
              data-tip="Нажмите, чтобы сохранить данное объявление в виде архива"
            >
              Подробнее
            </a>}

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
  colWidth: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.number,
};

export default TeaserSide;
