import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { circlePreloader, abbrNum, numberWithSpaces } from '../../../../components/advertika/helpers.jsx';
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
    return <div className={`mb1 ${className}`}>{trend + numberWithSpaces(number)}</div>;
  };

  const lockedClassname = cx({ __locked: !props.access && props.public.original_id !== 638144925 });

  return (
    <div className="public-ig_tmp">
      <div className="public-ig_brief">
        <div className="public-ig_tmb">
          <img className="img-responsive" src={props.public.img} />
        </div>
        <div className="public-ig_username clearfix mb1">

          <a
            href={props.public.outLink}
            target="_blank"
            title={props.public.username}
          >
            @{props.public.username}
          </a>
          {!!props.closed && <i className="ion-locked" />}
        </div>
        <div className="clearfix mb1">
{/*  закоментировано за ненадобностью
          <div className="col_half left">
            <i className="ion-heart txt-danger" />
            <span
              title={this.props.like_cnt}
                > {abbrNum(this.props.like_cnt,1)}
            </span>

          </div>
          <div className="col_half left">
            <i className="ion-chatbox txt-success" />
            <span
              title={this.props.com_cnt}
                > {abbrNum(this.props.com_cnt,1)}
            </span>

          </div>
*/}

        </div>
        {(!props.detailInfo && (props.access || props.public.original_id == 638144925)) &&
          <a href={props.public.inLink} className="__success __block button" target="_blank">
            Подробнее
          </a>}

      </div>
      <div className="public-ig_detail">
        <table className="public-ig_table">
          <thead>
            <tr>
              <th >
                Аудитория
              </th>
              <th
                style={{ width: '170px' }}
                data-tip="Демографическое распределение определяется <br>по привязанным к аккаунтам страницам ВК"
              >
                Пол / Возраст
              </th>
              <th style={{ width: '190px' }}>
                Вовлеченность
              </th>
              <th
                style={{ width: '100px' }}
                data-tip="Географическое распределение определяется <br>по привязанным к аккаунтам страницам ВК"
              >
                Гео
              </th>
              <th style={{ width: '115px' }}>
                Возраст страницы
              </th>
              <th style={{ width: '90px' }} data-tip="Общее количество публикаций профиля">
                Постов
              </th>
              <th style={{ width: '255px' }}>
                Рекламных постов
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="center" >
                <div className="txt-disabled">Подписчики</div>
                <div>{numberWithSpaces(props.audience.followed_cnt)}</div>
                <div data-tip="Изменение количества подписчиков">
                  { coloringDigits(props.audience.followed_diff)}
                </div>
                {/* <div className="txt-success mb1">+{this.props.audience.followed_diff}</div> */}

                <div className="txt-disabled">Подписок</div>
                <div>{numberWithSpaces(props.audience.follows_cnt)}</div>
                <div data-tip="Изменение количества подписок">
                  { coloringDigits(props.audience.follows_diff)}
                </div>
                {/* <div className="txt-danger">{this.props.audience.follows_diff}</div> */}
                <div data-tip="Неактивные пользователи">
                  <div className="txt-disabled">
                    Ботов
                  </div>
                  <div className={lockedClassname}>{props.bot}</div>
                </div>

              </td>
              <td>
                <div className="clearfix mb1">
                  <div className={`col_half left ${lockedClassname}`}>
                    <i className="ion-female " /> {props.sex.female}
                  </div>
                  <div className={`col_half left ${lockedClassname}`}>
                    <i className="ion-male " /> {props.sex.male}
                  </div>
                </div>
                <div className="mb1">
                {props.ageAvg.map((c, i) => (
                  <div className="clearfix" key={i}>
                    <div className="col_three-quarter txt-disabled left">{c.label}</div>
                    <div className={`col_fourth left ${lockedClassname}`}>{c.value}</div>
                  </div>
                ))}
                </div>
                <div
                  className="center"
                  data-tip={`
                    % подписчиков, у которых есть аккаунт ВКонтакте,<br>
                    по которым определяются гео и гендерные параметры профиля
                  `}
                >
                  <b>% VK</b>
                  <div>{props.vk_link}</div>
                </div>
              </td>
              <td>
                <div className="clearfix mb3">


                    <div
                      className="col_two-thirds txt-disabled left"
                      data-tip={`
                        Среднее значение вовлеченности аудитории профиля за месяц. <br>
                        Рассчитывается как среднее арифметическое ER поста среди всех постов за месяц.<br>
                        ER поста = (Кол-во лайков + Кол-во комментариев)х100 % / кол-во подписчиков.
                      `}
                    >
                      ER ср. за месяц:
                    </div>
                    <div className="col_third left">
                      {props.er.month.er_agv}
                    </div>
                    {
                  /*
                    <div className="col_half txt-disabled left">ER max:</div>
                    <div className="col_half left">
                      {props.er.month.er_max}
                    </div>
                    <div className="col_half txt-disabled left">ER min:</div>
                    <div className="col_half left">
                      {props.er.month.er_min}
                    </div>
                    */}



                    <div
                      className="col_two-thirds txt-disabled left"
                      data-tip={`
                        Среднее значение вовлеченности аудитории профиля за неделю. <br>
                        Рассчитывается как среднее арифметическое ER поста среди всех постов за неделю. <br>
                        ER поста = (Кол-во лайков + Кол-во комментариев)х100 % / кол-во подписчиков.
                      `}
                    >
                      ER ср. за неделю:
                    </div>
                    <div className="col_third left">
                      {props.er.week.er_agv}
                    </div>
  {
                  /*
                    <div className="col_half txt-disabled left">ER max:</div>
                    <div className="col_half left">
                      {props.er.week.er_max}
                    </div>
                    <div className="col_half txt-disabled left">ER min:</div>
                    <div className="col_half left">
                      {props.er.week.er_min}
                    </div>
                     */}

                </div>
                <div className="clearfix">
                  <div
                    data-tip="Среднее количество лайков на один пост"
                    className="col_two-thirds txt-disabled left"
                  >
                    <i className="ion-heart txt-danger" />
                    {' / пост:'}
                  </div>
                  <div className="col_third left">
                    {abbrNum(props.like_post, 1) || '0'}
                  </div>
                  <div
                    data-tip="Среднее количество коментариев на один пост"
                    className="col_two-thirds txt-disabled left"
                  >
                    <i className="ion-chatbox txt-success" />
                    {' / пост:'}
                  </div>
                  <div className="col_third left">
                    {abbrNum(props.comment_post, 1) || '0'}
                  </div>
                  <div className="col_two-thirds txt-disabled left">
                    Упоминаний:
                  </div>
                  <div className="col_third left">
                    {abbrNum(props.reference, 1)}
                  </div>
                </div>
              </td>
              <td>
                <ul>
                  {!!props.geo.length &&
                    props.geo.sort((a, b) => {
                      if (Number(a.value.replace('%', '')) > Number(b.value.replace('%', ''))) {
                        return -1;
                      }
                      if (Number(a.value.replace('%', '')) < Number(b.value.replace('%', ''))) {
                        return 1;
                      }
                      return 0;
                    }).slice(0, 5).map(country => (
                      <li key={country.code}>
                        <span
                          className={`i-geo ${country.code}`}
                          style={{ verticalAlign: 'middle' }}
                          data-tip={country.label}
                        />
                        {' '}
                        <span className={lockedClassname}>
                          {country.value}
                        </span>
                      </li>
                  ))}
                </ul>
              </td>
              <td className="center">
                <div><i className="ion-android-clock" /> {props.profile_age.first}</div>
                <div className="mb2">{props.profile_age.dayLife}</div>
                <div className="txt-disabled">Последний пост</div>
                <div><i className="ion-android-clock" /> {props.profile_age.last}</div>
              </td>
              <td className="center">
                <strong style={{ fontSize: 18 }} title={props.posts.total}>
                  {abbrNum(props.posts.total, 1)}
                </strong>
              </td>
              <td>
                <AdPostsCell {...AdPostData} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="public-ig_info">
          <div className="public-ig_descr">
            <h5>{props.public.full_name}</h5>
            <div className="break-word">{props.public.bio}</div>
          </div>
          <div className="public-ig_contacts">
            <div className="clearfix">
              <div className="left col_two-thirds">
                <h5>Контакты</h5>
                <div className="clearfix">
                  <div className="left col_two-thirds">
                     {!!props.contacts.site &&
                      <div className="public-ig_website-link ion-home">
                        {' '}
                        <span className="txt-primary">
                          {props.contacts.site.replace(/(https:\/\/)|(http:\/\/)/gi, '')}
                        </span>
                        {' '}
                        <a className="ion-share" href={props.contacts.site} target="_blank" />
                      </div>}
                  </div>
                  {!!props.contacts.site &&
                    <Redirects publicId={props.public.original_id} username={props.public.username} />}
                </div>

                {!!props.contacts.email &&
                  <div className="public-ig_email ion-email">
                    {' '}
                    <span className="txt-primary">
                       {props.contacts.email}
                    </span>
                  </div>}
              </div>
              {!!(!!props.contacts.phone && !!props.contacts.phone.length) &&
                <div className="left col_third relative">
                  <h5>Телефоны</h5>
                    <Phones data={props.contacts.phone} />
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Public.propTypes = {
  bot: React.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  vk_link: React.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  access: PropTypes.number,
  ageAvg: PropTypes.array,
  audience: PropTypes.object,
  closed: PropTypes.number,
  com_cnt: PropTypes.number,
  comment_post: PropTypes.number,
  contacts: PropTypes.object,
  er: PropTypes.object,
  exchange: PropTypes.array,
  geo: PropTypes.array,
  like_cnt: PropTypes.number,
  like_post: PropTypes.number,
  posts: PropTypes.object,
  profile_age: PropTypes.object,
  public: PropTypes.object,
  reference: PropTypes.number,
  sex: PropTypes.object,

};


class Redirects extends Component {
  constructor(props) {
    super(props);

    this.state = { showMore: false };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ showMore: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleShowMore() {
    this.setState({ showMore: !this.state.showMore });
    document.addEventListener('click', this._outsideClick);
  }

  fetchReredirects() {
    const { publicId, username } = this.props;
    if (this.state.data === undefined) {
      $.post('/public/ig/default/load', {
        method: 'redirects',
        filter: 'public',
        params: { publicId, username },
      }, result => {
        this.setState({ data: result });
      }, 'json');
    }
  }

  render() {
    const { showMore, data } = this.state;

    const content = (redirects) => redirects.map((redirect, i) => (
      <div className="link-box __sm" key={i}>
        <span className="link-box_link">{redirect}</span>
        {' '}
        <a className="link-box_ico" href={redirect} target="_blank"></a>
      </div>
    ));

    const nocontent = (isLoaded) => isLoaded === false ? 'Редиректы не обнаружены' : circlePreloader(20, 20);

    return (

      <div className="left col_third relative">
        <span
          onClick={this.handleShowMore}
          onMouseEnter={() => this.fetchReredirects()}
          className="dashed-link __success"
        >
          Редиректы
        </span>
        {!!showMore &&
          <div
            className="public-ig_redirects-dropdown p1 border rounded absolute "
            style={{ background: '#fff', width: '300px', zIndex: '99', left: '50%', marginLeft: '-150px' }}
          >
            {data
              ? content(data)
              : nocontent(data)}
          </div>
        }
      </div>
    );
  }
}

Redirects.propTypes = {
  list: PropTypes.array,
};


class AdPostsCell extends Component {
  constructor(props) {
    super(props);

    this.state = { showMore: false };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    var isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ showMore: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleShowMore() {
    this.setState({ showMore: !this.state.showMore });
    document.addEventListener('click', this._outsideClick);
  }

  render() {
    const limitCostList = !this.state.showMore ? 3 : undefined;
    const costOfPostList = (list) => list.slice(0, limitCostList).map(c => (
      <li className="clearfix" key={c.name}>
        <div className="left" style={{ width: '37%' }}>
          <div className="link-box __sm">
            <span
              className="link-box_link"
              title={c.name}
            >
              {c.name}
            </span>
            {' '}
            <a
              className="ion-share txt-primary "
              href={c.url}
              target="_blank"
            />
          </div>
        </div>
        <div className="left" style={{ width: '38%' }}>{c.price}</div>
        <div className="left a-right" style={{ width: '25%' }}>
          <span
            className="link"
            data-place="left"
            data-tip={`
              На первом месте: ${c.condition.efp}<br>
              В ленте: ${c.condition.edd}<br>
              Ближайшая публикация: ${c.condition.edp == '-2' ? '-' : c.condition.edp}<br>
              Тематика: ${c.condition.esub.join(', ')}<br>
            `}
          >
            условия
          </span>
        </div>
      </li>
    ));

    return (
      <div className={`public-ig_adposts-cell ${this.state.showMore ? '__visible' : ''}`}>
        <div className="mb1 center">{this.props.posts} / <strong style={{fontSize:18}}>{this.props.percent != '-' ? this.props.percent+'%' :'-'}</strong></div>
      {!!this.props.exchangeList.length &&
        <div>
          <div>
            Цена на бирже и условия:
            {' '}
            <i
              className="ion-android-information post-ig_public-inf"
              data-place="left"
              data-tip={`
                  Если страница представлена на <br>
                  нескольких биржах, фильтрация<br>
                  по ценам происходит от самой<br>
                  минимальной<br>
              `}
            />
            </div>
            <ul>
              {costOfPostList(this.props.exchangeList)}
            </ul>
            {(this.props.exchangeList.length > 3) &&
              <span
                className="public-ig_adposts-showmore"
                onClick={this.handleShowMore}
              >
                {!this.state.showMore ? '+ еще биржи' : '- свернуть'}
              </span>
            }
        </div>
      }
      </div>
    );
  }
}

class Phones extends Component {
  constructor(props) {
    super(props);

    this.state = { showMore: false };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ showMore: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleShowMore() {
    this.setState({ showMore: !this.state.showMore });
    document.addEventListener('click', this._outsideClick);
  }

  render() {
    const limit = !this.state.showMore ? 1 : undefined;
    const phoneList = (list) => list.slice(0, limit).map(c => (
      <div key={c}>
        <i className="ion-ios7-telephone" />
        {` ${c}`}
      </div>
    ));
    return (
      <div className={`public-ig_phones-dd ${this.state.showMore ? '__visible' : ''}`}>
        <ul>
          {phoneList(this.props.data)}
        </ul>
        {(this.props.data.length > 1 && !this.state.showMore) &&
          <span className="dashed-link __success ml2" onClick={this.handleShowMore} >
            + еще телефоны
          </span>
        }
      </div>
    );
  }
}

Phones.propTypes = {
  data: PropTypes.array,
};

export default Public;
