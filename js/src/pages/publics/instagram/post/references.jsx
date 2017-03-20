import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { circlePreloader } from '../../../../components/advertika/helpers';
import Tooltip from 'rc-tooltip';

class References extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      load: true,
    };
  }

  componentWillMount() {
    const { postId, publicId } = this.props;
    if (!this.state.data.length) {
      $.getJSON('/public/ig/default/load', {
        method: 'getPostReference',
        filter: 'post',
        params: { postId, publicId },
      }, result => {
        this.setState({
          data: result,
          load: false,
        });
      });
    }
  }

  render() {
    const { postId, publicId } = this.props;

    if (this.state.load) {
      return circlePreloader(200, 80);
    }

    const renderList = (data) => data.map((item, index) => (
      <li key={index} className="mb1 row">
        <div className="left col-35 ellipsis">
          <a href={item.outLink} target="_blank" title={`@${item.username}`} >{`@${item.username}`}</a>
        </div>
        <div className="left col-35 ellipsis">
        {item.link !== '' &&
          <a href={item.link} target="_blank">{item.link.replace(/(https:\/\/)|(http:\/\/)/gi, '')}</a>
          }
        </div>
        <div className="left col-30">
          {item.link !== '' && <Redirects {...{ postId, publicId, username: item.username }} /> }
        </div>
      </li>
    ));

    return (
      !!this.state.data.length &&
      <div className="p-ig-post_references">
        <ul>
          {renderList(this.state.data)}
        </ul>
      </div>
    );
  }
}

class Redirects extends Component {
  constructor() {
    super();
    this.state = { showMore: false, data: [] };
    // this._outsideClick = this._outsideClick.bind(this);
    // this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentWillUnmount() {
    // document.removeEventListener('click', this._outsideClick);
  }

  // _outsideClick(e) {
  //   const isClickInside = ReactDOM.findDOMNode(this).contains(e.target);
  //   if (!isClickInside) {
  //     this.setState({ showMore: false });
  //     document.removeEventListener('click', this._outsideClick);
  //   }
  // }

  // handleShowMore() {
  //   this.setState({ showMore: !this.state.showMore });
  //   document.addEventListener('click', this._outsideClick);
  // }

  fetchReredirects() {
    const { postId, publicId, username } = this.props;
    if (!this.state.data.length) {
      $.post('/public/ig/default/load', {
        method: 'redirects',
        filter: 'post',
        params: { postId, publicId, username },
      }, result => {
        this.setState({ data: result });
      }, 'json');
    }
  }

  render() {
    const noRedirectsContent = (isLoaded) => isLoaded === false ? 'Редиректы не обнаружены' : circlePreloader(20, 20);

    const renderContent = (redirectList) => redirectList.map((redirect, i) => (
      <div className="link-box __sm" key={i}>
        <span className="link-box_link">{redirect.replace(/(https:\/\/)|(http:\/\/)/gi, '')}</span>
        {' '}
        <a className="link-box_ico" href={redirect} target="_blank"></a>
      </div>
    ));

    return (
      <div className="relative">
        <Tooltip
          trigger={['click']}
          placement="top"
          overlay={<div style={{ width: '300px' }}>
            {!!this.state.data.length
              ? renderContent(this.state.data)
              : noRedirectsContent(this.state.data)}
          </div>}
          arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
          destroyTooltipOnHide
        >
          <span
            // onClick={this.handleShowMore}
            onMouseEnter={() => this.fetchReredirects()}
            className="dashed-link __success"
          >
            Редиректы
          </span>
        </Tooltip>
        {/* !!this.state.showMore &&
          <div
            className="public-ig_redirects-dropdown p1 border rounded absolute a-left"
            style={{ background: '#fff', width: '300px', zIndex: '99', right: '0px' }}
          >
            {!!this.state.data.length
              ? renderContent(this.state.data)
              : circlePreloader(30, 20)
            }
          </div> */}
      </div>
    );
  }
}


export default References;
