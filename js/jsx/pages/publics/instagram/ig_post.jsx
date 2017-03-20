import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

import Post from './post/post_template';
import Comments from './post/comments_template';
import References from './post/references';
import ReactTooltip from '../../../components/react-tooltip/react-tooltip';
import PostsTable from './post/Posts_table';
import NorificationSystem from 'react-notification-system';

  // _openNotification(message) {
  //   this.refs.notificationSystem.addNotification(message);
  // }

class IGPost extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._openNotification = this._openNotification.bind(this);
  }


  _openNotification(message) {
    this.refs.notificationSystem.addNotification(message);
  }


  render() {
    return (
      <div>
        <div className="row mb2">
          <div className="left col-33">
            <Post
              post={this.props.post}
              public={this.props.public}
              notificationSystem={this._openNotification}
            />
          </div>
          <div className="left col-33">
            <h4>Упоминания и ссылки:</h4>
            <References postId={this.props.post.postId} publicId={this.props.public.original_id} />
          </div>
          <div className="left col-33">
            <h4>Комментарии:</h4>
            <Comments postId={this.props.post.postId} />
          </div>

        </div>
        <PostsTable
          columns={this.props.tableColumns}
          controls={this.props.tabsConfig}
        />
        <ReactTooltip place="top" type="light" effect="float" multiline />
        <NorificationSystem
          ref="notificationSystem"
          allowHTML
          style={{
            Containers: {

              tc: { top: '25%' },
            },
            NotificationItem: {
              DefaultStyle: { boxShadow: '0 0 30px rgba(0,0,0, .7)', padding: '20px' },
            },
          }}
        />
      </div>
    );
  }
}

IGPost.defaultProps = {
  ...window.igPostPageCfg(),
  ...window.igPostPageData(),
};

IGPost.propTypes = {
  tableColumns: PropTypes.array,
  tabsConfig: PropTypes.array,
  post: PropTypes.object,
  public: PropTypes.object,
};

render(<IGPost />, document.getElementById('ig_post'));

