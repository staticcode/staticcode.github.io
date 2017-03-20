import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { abbrNum } from '../helpers';
import Emoji from '../emoji';





class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRedirects: false,
      showSearchForLink: false,
    };

    this._outsideClick = this._outsideClick.bind(this);
    this.makeLink = this.makeLink.bind(this);
    this.handleFilterByType = this.handleFilterByType.bind(this);
    this.handleFilterByRepost = this.handleFilterByRepost.bind(this);
    this.handleFilterByLink = this.handleFilterByLink.bind(this);
    this.handleToggleSearchForLink = this.handleToggleSearchForLink.bind(this);
    this.handleShowRedirects = this.handleShowRedirects.bind(this);
    this.handleHideRedirects = this.handleHideRedirects.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({
        showRedirects: false,
        showSearchForLink: false,
      });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  makeLink(cfg, typePost) {
    // Object.keys(data).map(function(k) {
    //     return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    // }).join('&')
    const TYPEPOST = {
      1: 'post_in',
      2: 'post_out',
      3: 'post_repost',
    };

    return '/public/vk/post/ad?' + $.param({ ...{ typePost: TYPEPOST[typePost], page: 1 }, ...cfg });
  }

  handleFilterByType(type) {
    const { post, type: typePost, group } = this.props;
    return this.makeLink({ button: { group, post, type, typePost } }, typePost);
  }

  handleFilterByRepost(type) {
    const { post_orig,  group_orig, type: typePost } = this.props;
    return this.makeLink({ button: { type, group_orig, post_orig } }, typePost);
  }

  handleFilterByLink(link) {
    let str = link;
    if (!link.indexOf('.php')) {
      str = link.substring(0, link.indexOf('.php'));
    }
    return this.makeLink({ inputField: str }, this.props.type);
  }

  handleToggleSearchForLink(state) {
    this.setState({ showSearchForLink: state });
    document.addEventListener('click', this._outsideClick);
  }

  handleShowRedirects(i) {
    this.setState({
      showRedirects: true,
      indexRedirects: i,
    });
    document.addEventListener('click', this._outsideClick);
  }

  handleHideRedirects() {
    this.setState({
      showRedirects: false,
    });
  }

  render() {
    const imagesGrid = (images) => {
      switch (images.length) {
        case 2:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '49%', height: '99%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '49%', height: '99%', margin: '2px' }}
              />
            </div>
          )
        case 3:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '99%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '49%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '49%', height: '49%', margin: '2px' }}
              />
            </div>
          );
        case 4:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '50%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '48%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '48%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '50%', height: '49%', margin: '2px' }}
              />
            </div>
          );
        case 5:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '49%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '49%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '32%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '32%', height: '49%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
                style={{ backgroundImage: `url(${images[4]})`, width: '32%', height: '49%', margin: '2px' }}
              />
            </div>
          );
        case 6:
          return (
            <div>
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '33%', height: '49%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '31%', height: '49%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '32%', height: '49%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '31%', height: '49%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
                style={{ backgroundImage: `url(${images[4]})`, width: '32%', height: '49%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[5])}`}
                style={{ backgroundImage: `url(${images[5]})`, width: '33%', height: '49%', margin: '2px' }}
              />
            </div>
          );
        case 7:
          return (
            <div>
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '48%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '50%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
                style={{ backgroundImage: `url(${images[4]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[5])}`}
                style={{ backgroundImage: `url(${images[5]})`, width: '50%', height: '32%', margin: '2px' }}
              />
              <a                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[6])}`}
                style={{ backgroundImage: `url(${images[6]})`, width: '48%', height: '32%', margin: '2px' }}
              />
            </div>
          );
        case 8:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '49%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '49%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '31%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '33%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
                style={{ backgroundImage: `url(${images[4]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[5])}`}
                style={{ backgroundImage: `url(${images[5]})`, width: '33%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[6])}`}
                style={{ backgroundImage: `url(${images[6]})`, width: '31%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[7])}`}
                style={{ backgroundImage: `url(${images[7]})`, width: '32%', height: '32%', margin: '2px' }}
              />
            </div>
          );
        case 9:
          return (
            <div>
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
                style={{ backgroundImage: `url(${images[0]})`, width: '31%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
                style={{ backgroundImage: `url(${images[1]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
                style={{ backgroundImage: `url(${images[2]})`, width: '33%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
                style={{ backgroundImage: `url(${images[3]})`, width: '33%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
                style={{ backgroundImage: `url(${images[4]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[5])}`}
                style={{ backgroundImage: `url(${images[5]})`, width: '31%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[6])}`}
                style={{ backgroundImage: `url(${images[6]})`, width: '32%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[7])}`}
                style={{ backgroundImage: `url(${images[7]})`, width: '31%', height: '32%', margin: '2px' }}
              />
              <a
                href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[8])}`}
                style={{ backgroundImage: `url(${images[8]})`, width: '33%', height: '32%', margin: '2px' }}
              />
            </div>
          );
        case 10:
          return (
            <div>
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}
              style={{ backgroundImage: `url(${images[0]})`, width: '32%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[1])}`}
              style={{ backgroundImage: `url(${images[1]})`, width: '33%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[2])}`}
              style={{ backgroundImage: `url(${images[2]})`, width: '31%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[3])}`}
              style={{ backgroundImage: `url(${images[3]})`, width: '24%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[4])}`}
              style={{ backgroundImage: `url(${images[4]})`, width: '24%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[5])}`}
              style={{ backgroundImage: `url(${images[5]})`, width: '24%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[6])}`}
              style={{ backgroundImage: `url(${images[6]})`, width: '24%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[7])}`}
              style={{ backgroundImage: `url(${images[7]})`, width: '33%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[8])}`}
              style={{ backgroundImage: `url(${images[8]})`, width: '31%', height: '32%', margin: '2px' }}
            />
            <a
              href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[9])}`}
              style={{ backgroundImage: `url(${images[9]})`, width: '32%', height: '32%', margin: '2px' }}
            />
            </div>
          );
        default :
          return (
            <a href={`/public/vk/post/downloadimg?src=${encodeURIComponent(images[0])}`}>
              <img src={images[0]} className="img-responsive" />
            </a>
          );
      }
    };

    const Header = (
      !!this.props.header &&
        <header className="post-vk_header mb1">
          <div className="post-vk_public-inf clearfix">
            <div className="left" style={{ width: '35px' }}>
              <a
                href={this.props.publink}
                target="_blank">
                <img className="img-responsive" src={this.props.pubtmb} />
              </a>
            </div>
            <div className="ovh" style={{ paddingLeft: '5px' }}>
              <div className="clearfix">
                <div className="left col_three-quarter">
                  <div className="link-box">

                    <a
                      target="_blank"
                      className="link-box_link"
                      href={this.props.publink}
                    >
                      {this.props.pubname}
                    </a>


                  </div>
                </div>
                <div className="left col_fourth">
                {!!this.props.postsource &&
                  <a
                    className="button __primary __xxs ml1 __block"
                    href={this.handleFilterByType('repostInPub')}
                    target="_blank"
                  >
                    Репосты в паблике
                  </a>}
                </div>
              </div>
              <div className="h6">
                Аудитория: <strong>{this.props.pubaud}</strong>
                {' | '}
                ER день: <strong>{this.props.puberday}</strong>
                {' | '}
                 Сред. ER пост: <strong>{this.props.pubmider}</strong>
                {' | '}
                 Цена: <strong>{this.props.pubprice}</strong>
                {' | '}
                 CPM: <strong>{this.props.pubcpm}</strong>
              </div>
            </div>
          </div>
          {!!this.props.postsource &&
          <div className="post-vk_source-inf">
            <div className="clearfix">
              <div className="left" style={{width:35}}>
                <img className="img-responsive" src={ this.props.postsource.pubtmb} />
              </div>
              <div className="left" style={{'width':'calc(100% - 35px)', 'paddingLeft':'5px'}}>
                <div className="left col_three-quarter">
                  <div className="link-box">
                    <a
                      className="link-box_link ion-arrow-return-right"
                      // style={!this.props.postsource.extLink ? {'maxWidth':'100%'} : null}
                      href={this.props.postsource.publink}>
                      {this.props.postsource.pubname}
                    </a>
                  </div>
                </div>
                <div className="left col_fourth">
                  <a
                    className="button __primary __xxs __block "
                    href={this.handleFilterByRepost('repostOutPub')}
                    target="_blank"
                    style={{ marginBottom: 1 }}
                  >
                    Репосты паблика
                  </a>
                  <a
                    className="button __primary __xxs __block"
                    href={this.handleFilterByRepost('repostPost')}
                    target="_blank"
                  >
                    Репосты поста
                  </a>
                </div>
              </div>
            </div>
          </div>}
        </header>
      );

    const postBody = (
      <div className="post-vk_body">
        <div
          className={`post-vk_thumbnail ${this.props.postsource ? 'ml4' : ''}`}
          ref="thumbnail"
        >

        {!!this.props.tmb.length && imagesGrid(this.props.tmb.slice(0, 10))}
        {!!this.props.ifrm.length && <iframe width="100%" height="300" src={this.props.ifrm[0]} frameborder="0"></iframe>}
        {(!this.props.ifrm.length && !this.props.tmb.length) &&

          <div
            style={{
              background: '#d5d5d5',
              color: '#fff',
              height: '300px',
              lineHeight: '300px',
              fontSize: '35px',
            }}
            children="Пост без изображения"
          />
          }

        </div>
        <div
          className={`post-vk_content ${this.props.postsource ? 'ml4' : ''}`}
          dangerouslySetInnerHTML={{ __html: Emoji.emojiToHTML(this.props.descr, true) }}
        />
        {!!this.props.postsource &&
          <div className="h6 ml4 clearfix mb1">
            <div className="left col_half">

              <span>{moment.unix(this.props.postsource.dateInt).locale("ru").format("lll")}</span>{/*дата публикации поста*/}
            </div>
            <div className="left col_half a-right">
              <strong>ER:</strong> {this.props.postsource.puberpost}
              <span className="ion-speakerphone ml1" data-tip="Репостов">{' '}{abbrNum(this.props.postsource.share,1)}</span>{/*Количество репостов*/}
              <span className="ion-heart ml1" data-tip="Лайков">{' '}{abbrNum(this.props.postsource.likes,1)}</span>{/*Количество лайков*/}
              <span className="ion-chatbox ml1" data-tip="Комментариев">{' '}{abbrNum(this.props.postsource.comments,1)}</span>{/*Количество лайков*/}
            </div>
          </div>
        }
      </div>
    );
    const Footer = <footer className="post-vk_footer clearfix h6">
          <div className="left col_two-thirds">
            {this.props.is_delete == "0"
              ?<a href={this.props.linkPost} className="i-vk-exchange align-middle mr1" target="_blank"data-tip="Ссылка на источник поста"></a>
              :<span className="ion-trash-b txt-disabled mr1 h4" data-tip="Пост удален"/>}

            {/*<span>{this.props.date}</span>дата публикации поста*/}
            <span>{moment.unix(this.props.dateInt).locale("ru").format("lll")}</span>{/*дата публикации поста*/}
            {' '}
            {(!this.props.postsource && this.props.type != 0) &&
              <a
                className="button __primary __xxs"
                target="_blank"
                href={this.handleFilterByType('similarPost')}
              >
                Похожие посты
              </a>
            }
            {' '}
            {(this.props.type != 0 && this.props.links !== null) &&
              <a
                className="button __primary __xxs"

                onClick={this.handleToggleSearchForLink.bind(null, true)}
              >
                Искать по ссылке
              </a>
              }

          </div>
          <div className="left col_third a-right">
            <div>
              <strong>ER:</strong> {this.props.er}
              <span className="ion-speakerphone ml1 " data-tip="Репостов">
                {' '}{abbrNum(this.props.share,1)}
              </span>
            </div>
            <div>
              <span className="ion-heart ml1" data-tip="Лайков">
                {' '}{abbrNum(this.props.likes,1)}
              </span>
              <span className="ion-chatbox ml1" data-tip="Комментариев">
                {' '}{abbrNum(this.props.comments,1)}
              </span>
            </div>
          </div>
        </footer>;

    const linksAndRedirects = this.props.links && this.props.links.length && this.props.type != 0
          ?<div className="post-vk_redirects ">
            {this.props.links.map(
              (c,i)=>   <div className="clearfix" key={c.link}>
                    <div className="left col_three-quarter">
                      <div className="link-box" >
                        <span className="link-box_link">
                          {c.link.replace(/(https:\/\/)|(http:\/\/)/gi, '')}
                        </span>
                        <a href={c.link} target="_blank" className="link-box_ico"/>
                      </div>
                    </div>
                    <div className="left col_fourth a-right">
                      {c.redirects.length
                        ?<span
                          onClick={this.handleShowRedirects.bind(null, i)}
                          className="dashed-link __success">
                          Редиректы
                        </span>
                        :null}
                    </div>
                  </div>
              )}
          </div>
          :null;
    const referenceModal = !!this.state.showRedirects &&
            <div className="post-ig_reference-modal">
              <button
                className="close-button right ml1 js-closeRef"
                onClick={this.handleHideRedirects}
                children=" X "/>
              {this.props.links[this.state.indexRedirects].redirects.map(
                (c, i) => <div className="link-box ovh" key={i}>
                      <span className="link-box_link">{c.replace(/(https:\/\/)|(http:\/\/)/gi, '')}</span>
                      <a className="link-box_ico" href={c} target="_blank"></a>
                    </div> )}
            </div>;

    const searchForLink = this.state.showSearchForLink
            ?<div className="post-ig_reference-modal" style={{width:500}}>
              <button
                className="close-button right ml1 js-closeRef"
                onClick={this.handleToggleSearchForLink.bind(null, false)}
                children=" X "/>
              <h4 className="h4 ovh">По какой ссылке ищем?</h4>
              {this.props.links.map(
              (c, i) =>   <div className="clearfix" key={c.link}>
                    <div className="left col_three-quarter">
                      <div className="link-box" >
                        <span className="link-box_link">{c.link.replace(/(https:\/\/)|(http:\/\/)/gi, '')}</span>
                      </div>
                    </div>
                    <div className="left col_fourth a-right">
                      <a
                        href={this.handleFilterByLink(c.link)}
                        target="_blank"
                        // onClick={this.handleFilterByLink.bind(null, c.link)}
                        className="dashed-link __success"
                      >
                        Искать
                      </a>
                    </div>
                    <div className="ml2">
                      {!!c.redirects.length &&
                        c.redirects.map(// для поиска "Збірна України пробилась на Євро-2016! Вітаємо!"
                          (redirect, index) => (
                            <div key={index} className="clearfix">
                              <div className="left col_three-quarter">
                                <div className="link-box ovh">
                                  <span className="link-box_link">
                                    {redirect.replace(/(https:\/\/)|(http:\/\/)/gi, '')}
                                  </span>
                                </div>
                              </div>
                              <div className="left col_fourth a-right">
                                <a
                                  href={this.handleFilterByLink(redirect)}
                                  target="_blank"
                                  // onClick={this.handleFilterByLink.bind(null, redirect)}
                                  className="dashed-link __success"
                                >
                                  Искать
                                </a>
                              </div>
                            </div>
                          )
                        )
                      }
                    </div>
                  </div>
              )}
            </div>

            :null;

    return (
      <article className="post-vk mb2 relative">
        {Header}
        {postBody}
        {Footer}
        {linksAndRedirects}
        {referenceModal}
        {searchForLink}
      </article>

    );
  }
}

export default Post;
