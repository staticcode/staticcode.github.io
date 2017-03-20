import React, { Component } from 'react';
import { circlePreloader, numberWithSpaces } from '../../../../components/advertika/helpers';
import Btn from '../../../../components/advertika/btnitem';


class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      ucnt: 0,
      items: [],
      page: 0,
    };

    this.handleGetMoreComments = this.handleGetMoreComments.bind(this);
  }

  componentWillMount() {
    this.handleGetMoreComments();
  }

  handleGetMoreComments() {
    let { page } = this.state;
    const { items } = this.state;


    this.setState({ loading: true });

    $.getJSON('/public/ig/default/load', {
      method: 'comment',
      filter: 'post',
      params: {
        post_id: this.props.postId,
        page,
      },
    }, result => {

      // const items = result.items.map(item => ({ ...item, id: Math.floor(Math.random() * (10000000 - 1 + 1)) + 1 }))
      // this.state.items.unshift(...items);
      this.setState({
        items: items.concat(result.items),
        count: result.count,
        ucnt: result.ucnt,
        loading: false,
        page: result.items.length ? ++page : page,
      });
    });
  }

  render() {
    const { count, items, loading, ucnt } = this.state;

    if (loading && !count) {
      return circlePreloader(200, 80);
    }

    return (
      count
        ? (
          <div>

            <div className="mb1">
              <i className="ion-chatbox txt-success" />
               {` ${numberWithSpaces(count)} комментариев от ${numberWithSpaces(ucnt)} пользователей`}
            </div>
            <div className="comments-ig border mb1 p1">
              {this.state.items.map((comment, i) =>
                <div className="comment-ig mb1" key={i}>
                  <a href={comment.outLink} target="_blank" className="comment-ig_username">@{comment.username}</a>
                  <span className="comment-ig_date">{comment.created}</span>
                  <div className="comment-ig_txt">{comment.text}</div>
                </div>
              )}
            </div>
            {(count > 5 && count !== this.state.items.length) &&
              <Btn
                className="__success __block"
                disabled={this.state.loading}
                children={this.state.loading ?'Загрузка' :'Загрузить еще 10 комментариев'}
                onClick={this.handleGetMoreComments}
              />}

          </div>
        )
        : <div>Пост без комментариев</div>
    );
  }
}


export default Comments;
