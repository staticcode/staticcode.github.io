import React, { Component, PropTypes } from 'react';
import { abbrNum, numberWithSpaces, circlePreloader } from '../../../../components/advertika/helpers';
import PublicTooltip from './Public_tooltip';



class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
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
      },
      public: {
        username,
        inLink,
        id,
      },
    } = this.props;
    return (
    <div>
      <div className="post-ig border mb1 p2">
        <div className="clearfix mb2">
          <div className="post-ig_public-tmb ">
            <img className="img-responsive" src={this.props.public.img} />
          </div>
          <div className="post-ig_public-name ">
            <a href={inLink}>@{username}</a>
            <PublicTooltip id={id} />
          </div>
          <div className="post-ig_post-date ">
            {created}
          </div>
        </div>
        <div>
          <div
            className={`post-ig_tmb mb1 ${video ? 'ion-ios7-play' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            {(!!downloadable && !video) &&
              <a
                href={`http://public.admobispy.ru/download/ig?type=${type}&pid=${postId}`}
                className="ion-android-download"
              />}
            {(!!downloadable && !!video && !deleted) &&
              <button
                className="ion-android-download"
                onClick={() => this.downloadVideo()}
              />}
            {this.state.loading && circlePreloader(290)}
          </div>
          <div className="allvam a-right">
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
            {' '}
            {!deleted
              ? <a href={link}
                target="_blank"
                className="post-ig_ext-link ion-social-instagram-outline"
              />
              : <span className="post-ig_ext-link ion-trash-b txt-disabled" data-tip="Пост удален" />}

          </div>
        </div>
      </div>

      <p
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 200,
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      >

      </p>
    </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object,
  public: PropTypes.object,
  notificationSystem: PropTypes.func,
};

Post.defaultProps = {
  access: true,
};

export default Post;


