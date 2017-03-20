import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PublicTooltip from '../../post/Public_tooltip';
import { circlePreloader, abbrNum, numberWithSpaces } from '../../../../../components/advertika/helpers';
import Tooltip from 'rc-tooltip';
// import Emoji from '../../../../../components/advertika/emoji';


class Post extends Component {
  constructor() {
    super();

    this.state = {
      showMore: false,
      pubInfoShow: false,
      refInfoShow: false,
    };

    this._outsideClick = this._outsideClick.bind(this);
    this.fetchReferences = this.fetchReferences.bind(this);
    // this.handleGetPubInfo = this.handleGetPubInfo.bind(this);
    this.handleHideRefInf = this.handleHideRefInf.bind(this);
    this.handleShowRefInf = this.handleShowRefInf.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }

  _outsideClick(e) {
    const tooltip = document.querySelector('.rc-tooltip');
    const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
    const isClickOnTooltip = tooltip && tooltip.contains(e.target);

    if (!isClickInside && !isClickOnTooltip) {
      this.setState({
        showMore: false,
        pubInfoShow: false,
        refInf: false,
      });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  downloadVideo() {
    if (!this.state.loading) {
      this.props.notificationSystem({
        message: 'Запущен процесс скачивания, <br> это может занять несколько секунд',
        level: 'success',
        autoDismiss: 5,
        position: 'tc',
      });
      this.setState({ loading: true });
      const { post: { video, postId }, public: { original_id } } = this.props;
      if (video) {
        $.post('/public/ig/default/download', { postId, publicId: original_id }, data => {

          if (data.success) {
            window.location = data.redirect;
          } else {
            this.props.notificationSystem({
              message: data.error,
              level: 'error',
              autoDismiss: 5,
              position: 'tc',
            });
          }

          this.setState({ loading: false });
        }, 'json');
      }
    }
  }

  fetchReferences() {
    if (!this.state.references && !this.state.refInfoShow) {
      this.fetchData({
        method: 'getPostReference',
        filter: 'post',
        params: {
          postId: this.props.post.postId,
          publicId: this.props.public.original_id,
        },
      }, 'references');
      this.setState({ refInfoShow: true });
    }
  }

  fetchReredirects(username) {
    if (this.state[`redirects@${username}`] === undefined) {
      this.fetchData({
        method: 'redirects',
        filter: 'post',
        params: {
          postId: this.props.post.postId,
          publicId: this.props.public.original_id,
          username,
        },
      }, `redirects@${username}`);
    }
  }



  // handleGetPubInfo() {
  //   if (!this.state.public && !this.state.pubInfoShow) {
  //     this.fetchData({ method: 'getPublicInfo', filter: 'post', params: { id: this.props.public.id } }, 'public');
  //     this.setState({ pubInfoShow: true });
  //   }
  // }

  handleHideRefInf() {
    this.setState({ refInf: false });
  }

  handleShowRefInf(i) {
    this.setState({
      refInf: true,
      sohwindexRef: i,
    });
  }

  handleShowMore() {
    this.setState({
      showMore: !this.state.showMore,
      refInf: false,
    });
    this.fetchReferences();
    document.addEventListener('click', this._outsideClick);
  }

  fetchData(config, stateKey) {
    $.getJSON('/public/ig/default/load', config, (result) => {
      if (result.success !== false) {
        this.setState({ [stateKey]: result });
      }
    });
  }

  render() {
    const {
      post: {
        created,
        video,
        img,
        downloadable,
        type,
        postId,
        er,
        likes,
        comments,
        deleted,
        link,
        text,
        inLink,
      },
    } = this.props;

    const noRedirectsContent = (isLoaded) => isLoaded === false ? 'Редиректы не обнаружены' : circlePreloader(20, 20);

    const renderRedirects = (redirectList) => redirectList.map((redirect, i) => (
      <div className="link-box __sm" key={i}>
        <span className="link-box_link">{redirect}</span>
        {' '}
        <a className="link-box_ico" href={redirect.replace(/(https:\/\/)|(http:\/\/)/gi, '')} target="_blank"></a>
      </div>
    ));

    const renderReferences = () => (
      this.state.references
      ? <div className="post-ig_references">
        {this.state.references.map((reference, i) => (
          <div key={i} className="row">
            <div className="left col-35 ellipsis">
              <a href={this.props.access ? reference.outLink : ''} title={`@${reference.username}`}>
                @{reference.username}
              </a>
            </div>
            <div className="left col-40 ellipsis">
            {reference.link !== '' &&
              <a href={reference.link} target="_blank">{reference.link.replace(/(https:\/\/)|(http:\/\/)/gi, '')}</a>
              }
            </div>
            <div className="left col-25 a-right relative">

            {reference.link !== '' &&

              <Tooltip
                ref="tooltip"
                trigger={['click']}
                placement="top"
                overlay={<div style={{ width: '300px' }}>
                  {this.state[`redirects@${this.state.sohwindexRef}`]
                    ? renderRedirects(this.state[`redirects@${this.state.sohwindexRef}`])
                    : noRedirectsContent(this.state[`redirects@${this.state.sohwindexRef}`])}
                </div>}
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                destroyTooltipOnHide
              >
                <span
                  className="dashed-link __success"
                  onClick={() => this.handleShowRefInf(reference.username)}
                  onMouseEnter={() => this.fetchReredirects(reference.username)}
                  data-tip
                  data-for={`${reference.username}${i}`}
                >
                  Редиректы
                </span>
              </Tooltip>}


            </div>
          </div>))}

      </div>
      : circlePreloader(27, 20)
    );

    return (
      <div className={`post-ig ${this.state.showMore ? '__ac' : ''}`}>
        <div className="post-ig_header ">
          <div className="post-ig_public-tmb ">
            <img className="img-responsive" src={this.props.public.img} alt="" />
          </div>
          <div className="post-ig_public-name ">
            <a href={this.props.public.inLink}>@{this.props.public.username}</a>
            <PublicTooltip id={this.props.public.id} />
          </div>
          <div className="post-ig_post-date ">
            {created}
          </div>
        </div>
        <div className={`post-ig_body ${this.state.showMore ? '__show' : ''}`}>
          <div className={`post-ig_tmb mb1 ${video ? 'ion-ios7-play' : ''}`} style={{ backgroundImage: `url(${img})` }}>

            {(!!downloadable && !video) &&
              <a
                href={`http://public.admobispy.ru/download/ig?type=${type}&pid=${postId}`}
                className="ion-android-download"
              />}
            {(!!downloadable && !!video && !deleted) &&
              <button className="ion-android-download" onClick={() => this.downloadVideo()} />}

            {this.state.loading && circlePreloader(290)}

          </div>
          <div className="post-ig_body-cnt">
            <p dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }} />

          </div>
          {renderReferences()}

        </div>
        <div className="post-ig_footer border">
          <div className="mb1">

            <strong style={{ marginRight: 4 }}>
              ER
            </strong>
               {er ? `${er}%` : 'Н/Д'}
            <span className="class ">
              <i className="ion-heart txt-danger" style={{ marginRight: 4, marginLeft: 20 }} />
              {abbrNum(likes, 1)}
            </span>
            <span className="class ">
              <i className="ion-chatbox txt-success" style={{ marginRight: 4, marginLeft: 20 }} />
              {abbrNum(comments, 1)}
            </span>
          </div>
          <div className="clearfix">
            <div className="post-ig_show-more dashed-link __success right" onClick={this.handleShowMore}>
              {this.state.showMore ? 'скрыть' : '+ еще'}
            </div>

            {deleted != 1
              ? <a href={link} target="_blank"className="post-ig_ext-link ion-social-instagram-outline left" />
              : <span className="post-ig_ext-link ion-trash-b txt-disabled left" data-tip="Пост удален" />
            }

            <a href={inLink} className="button __success __sm ml1 left" target="_blank">
              Открыть пост
            </a>


          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  access: PropTypes.bool,
  post: PropTypes.object,
  public: PropTypes.object,
};

Post.defaultProps = {
  access: true,
};

export default Post;
