import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';



export default class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sticky: true,
    };
    this.recomputeState = this.recomputeState.bind(this);

  }

  componentDidMount() {
    this.on(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.recomputeState);
    this.recomputeState();
  }

  recomputeState() {
    const distanceFromBottom = ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (distanceFromBottom <= windowHeight && this.state.sticky) {
      this.setState({ sticky: false });
    }

    if (distanceFromBottom > windowHeight && !this.state.sticky) {
      this.setState({ sticky: true });
    }
  }

  on(events, callback) {
    events.forEach((evt) => {
      window.addEventListener(evt, callback);
    });
  }

  off(events, callback) {
    events.forEach((evt) => {
      window.removeEventListener(evt, callback);
    });
  }



  render() {

    const access = window.access;
    return (
      <div className={`toolbar ${this.state.sticky ? '__fixed' : ''}`}>

      {toolbarData.map((item, i) => (

       <div className={`toolbar_item ${item.className}`} key={i}>
        {item.title &&
          <div className="toolbar_item-title">
            {item.title}
            {' '}
            {(() => {
              switch (item.type) {
                case 'selected':
                  return <strong>{this.props.selectedTeasers.length}</strong>;
                case 'favorite':
                  return <strong>{this.props.favorites}</strong>;
                default:
                  return null;
              }
            })()}

          </div>
        }
        <div className="toolbar_item-links">
        {item.links &&
          item.links.map((link, i) => {
            const LikTag = link.block ? 'div' : 'span';
            return (
              <LikTag
                key={i}
                onClick={this.props[link.func]}
                className={`link ${link.className ? link.className : ''}`}
              >
                {`${link.title} `}
              </LikTag>

            );
        })}
        </div>

        </div>

      ))}





      </div>
    );
  }
}
