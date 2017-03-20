import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Checkbox from '../advertika/CheckboxV2';
import { circlePreloader, abbrNum, numberWithSpaces } from '../advertika/helpers.jsx';
import cx from 'classnames';



const Public = (props) => {
  const AdPostData = {
    posts: props.posts.adv,
    percent: props.posts.perc_adv,
    exchangeList: props.exchange,
  };

  const coloringDigits = (number) => {
    let className = 'txt-primary';
    let trend = '';

    if (number !== 0) {
      if ((/\-/gi).test(number)) {
        className = 'txt-danger';
      } else {
        className = 'txt-success';
        trend = '+';
      }
    }
    return <div className={`${className}`}>{trend + numberWithSpaces(number)}</div>;
  };

  const lockedClassname = cx({ __locked: !props.access && props.public.original_id !== 638144925 });
  let sortedGeo = [];
  let selectedGeoIndex;
  if (!!props.geo.length) {
    sortedGeo = props.geo.sort((a, b) => Number(b.value.replace('%', '')) - Number(a.value.replace('%', '')));
  }

  if (!isNaN(Number(props.selectedGeo))) {
    selectedGeoIndex = sortedGeo.reduce((result, current, index) => {
      if (current.id == props.selectedGeo) {
        result = index;
      }
        return result;
    }, null);
    sortedGeo.splice(0, 0, sortedGeo.splice(selectedGeoIndex, 1)[0]);
  }
  const geoDataForRender = sortedGeo.slice(0, 3);

  const linkToDetailPubInfo = () => (props.access || props.public.original_id == 638144925)
    ? props.public.inLink
    : undefined;

  return (
    <div className="public-ig_tmp">
      <div className="public-ig_flex-cnt">
      <div>
        <div className="mb1 center clearfix public-ig_username">
          {!!props.closed &&
            <i
              className="ion-locked right ml1"
              data-tip="Закрытый аккаунт"
            />}
          <div className="ovh">
            <a
              href={linkToDetailPubInfo()}
              target="_blank"
              rel="noopener noreferrer"
              title={props.public.username}
              className="ellipsis"
              className={`ellipsis ${lockedClassname}`}
            >
              @{props.public.username}
            </a>
          </div>
        </div>
        <a
          className="public-ig__avatar"
          target="_blank"
          rel="noopener noreferrer"
          href={linkToDetailPubInfo()}
        >
          <img className="img-responsive" src={props.public.img} />
        </a>
          <Checkbox
            onChange={e => props.toggleSelected(e, props.public.original_id)}
            checked={props.selected}
          />
      </div>
      <div className="center" >

        <div className="center mb1">
          <b>Подписчики</b>
        </div>
        <div>{numberWithSpaces(props.audience.followed_cnt)}</div>
        <div data-tip="Изменение количества подписчиков" className="mb2">
          { coloringDigits(props.audience.followed_diff)}
        </div>

        <div data-tip="Неактивные пользователи">
          <div className="txt-disabled">
            Ботов
          </div>
          <div className={lockedClassname}>{props.bot}</div>
        </div>

      </div>
      <div>
        <div className="center mb1">
          <b>Гео</b>
        </div>

        {geoDataForRender.map(country => (
          <div key={country.code}>
            <span
              className={`i-geo ${country.code}`}
              style={{ verticalAlign: 'middle' }}
              data-tip={country.label}
            />
            {' '}
            <span className={lockedClassname}>
              {country.value}
            </span>
          </div>
        ))}

      </div>

{ false &&

      <div>
        <div className="center mb1">
          <b>Города</b>
        </div>


        {props.cities.map(city => (
          <div className="clearfix" key={city.id}>
            <div className="left col_three-quarter ellipsis">
              {city.label}
            </div>
            <div className="left col_fourth a-right">
              {city.value}
            </div>
          </div>
        ))}
      </div>

}

      <div>
        <div className="mb1">
          <b>Пол</b>
        </div>
        <div className={`mb2 ${lockedClassname}`} data-tip="% Мужчин">
          М {props.sex.male.replace(/\s/g,'')}
        </div>
        <div className={`${lockedClassname}`} data-tip="% Женщин">
          Ж {props.sex.female.replace(/\s/g,'')}
        </div>
      </div>

      <div>
        <div className="center mb1">
          <b>Возраст</b>
        </div>


        {props.ageAvg.map((c, i) => (
          <div className="clearfix" key={i}>
            <div className="col_three-quarter txt-disabled left">{c.label}</div>
            <div className={`col_fourth left ${lockedClassname}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb1">
          <b>Посты</b>
        </div>
        <div title={props.posts.total} className="mb2">
          {abbrNum(props.posts.total, 1)}
        </div>

        <div className="txt-disabled">рекламных</div>
        {props.posts.perc_adv}%
      </div>


      <div>
        <div className="mb1">
          <b>ER</b>
        </div>

          <div
            data-tip={`
              Среднее значение вовлеченности аудитории профиля за месяц. <br>
              Рассчитывается как среднее арифметическое ER поста среди всех постов за месяц.<br>
              ER поста = (Кол-во лайков + Кол-во комментариев)х100 % / кол-во подписчиков.
            `}
          >
            {props.er.month.er_agv.replace(/\s/g,'')}
          </div>

      </div>

      <div>
        <div className="center mb1">
          <b>Цена</b>
        </div>
        {props.exchange.length
          ? props.exchange.map((item, index) => (
            <div key={index}>
              {item.name}
              {' '}
              {item.price}
            </div>
          ))

          : <div className="center">
              нет на бирже
            </div>
        }

      </div>

      </div>
    </div>
  );
};

Public.propTypes = {
  bot: React.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedGeo: PropTypes.array,
  vk_link: React.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  access: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  ageAvg: PropTypes.array,
  audience: PropTypes.object,
  closed: PropTypes.number,
  com_cnt: PropTypes.number,
  comment_post: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  contacts: PropTypes.object,
  er: PropTypes.object,
  exchange: PropTypes.array,
  geo: PropTypes.any,
  like_cnt: PropTypes.number,
  like_post: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  posts: PropTypes.object,
  profile_age: PropTypes.object,
  public: PropTypes.object,
  reference: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sex: PropTypes.object,

};



export default Public;
