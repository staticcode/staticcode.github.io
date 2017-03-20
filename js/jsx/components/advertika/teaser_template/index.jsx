import React, { PropTypes, Component } from 'react';
import ReactDom from 'react-dom';
import TraserSide from './teaser_side';
import Checkbox from '../CheckboxV2';
import { circlePreloader } from '../helpers';


class TeaserTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this._outsideClick = this._outsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this._outsideClick);
  }
  _outsideClick(e) {
    const isClickInside = ReactDom.findDOMNode(this).contains(e.target);
    if (!isClickInside) {
      this.setState({ active: false });
      document.removeEventListener('click', this._outsideClick);
    }
  }

  handleClick() {
    const $ = ReactDom.findDOMNode;
    const thisWidth = $(this).offsetWidth;
    const thisHeight = $(this).offsetHeight;
    const thisOffsetLeft = $(this).offsetLeft;
    const documentWidth = document.body.clientWidth;
    const thisSideWidth = 290;

    const openRight = (documentWidth - (thisWidth + thisOffsetLeft + thisSideWidth)) < 0;

    document.addEventListener('click', this._outsideClick);
    this.setState({
      active: !this.state.active,
      openRight,
      SideMinHeight: thisHeight,
    });

    if (!this.state.side) {
      window.$.post('/teazer/list/info', { id: this.props.id }, result => {
        this.setState({ side: result });
      }, 'json');
    }
  }

  handleMouseDown() {
    if (!this.state.side) {
      window.$.post('/teazer/list/info', { id: this.props.id }, result => {
        this.setState({ side: result });
      }, 'json');
    }
  }

  toggleFavorite(action) {
    const { id, openNotification, decrementFavoritesCoun, incrementFavoritesCoun } = this.props;
    window.$.post(`/teazer/list/fav${action ? 'del' : 'add'}`, { ids: [id] }, result => {
      if (result.success === false && typeof result.msg !== 'undefined') {
        return openNotification({
          message: result.msg,
          level: 'warning',
          position: 'tc',
          autoDismiss: 5,
        });
      }
      const message = action ? 'удалено из избранного' : 'добавлено в избранное';
      openNotification({
        message: `Объявление ${message}. <a href="/teazer/favorites/index">Перейти в избранное</a>`,
        level: action ? 'warning' : 'success',
        position: 'tc',
        autoDismiss: 5,
      });
      this.setState({
        side: { ...this.state.side, is_fav: !action },
      });
      (action ? decrementFavoritesCoun : incrementFavoritesCoun)(1);

    }, 'json')
    .fail(() => openNotification({
      message: 'Неудалось добавить объявления!',
      level: 'error',
      position: 'tc',
      autoDismiss: 5,
    }));
  }

  render() {
    const {
      title,
      description,
      selected,
      domain,
      id,
      img,
      popIndex,
      net,
      toggleTeaserSelection,
    } = this.props;

    let activeClasses = '';
    if (this.state.active) {
      activeClasses = '__active';
      if (this.state.openRight) {
        activeClasses += ' __right';
      } else {
        activeClasses += ' __left';
      }
    }

    return (
      <div
        className={`m-teaser ${activeClasses}`}
      >
          <div className="m-teaser_cnt">
              <div className="m-teaser_cnt-t" onMouseDown={this.handleMouseDown} onClick={this.handleClick} data-tip="">
                  <div className="m-teaser_name">
                    {title}
                  </div>
                  <div className="m-teaser_domen">
                    {domain}
                  </div>
                  <div className="m-teaser_img" >
                    <img src={img} />
                  </div>
                  <div className="m-teaser_descript">
                    {description}
                  </div>
              </div>
              <div className="m-teaser_cnt-b">
                <Checkbox id={id} checked={selected} onChange={(e) => toggleTeaserSelection(id, e)}>
                  <div className="right">{net.title}</div>
                  <div className="ion-star" >
                    <span data-tip="Показатель популярности">
                      {popIndex}
                    </span>
                  </div>
                </Checkbox>
              </div>
          </div>
          <div
            className="m-teaser_side"
            ref="teazer_side"
            style={{ minHeight: this.state.SideMinHeight }}

          >
          {this.state.side
            ? <TraserSide {...{ ...this.props, ...this.state.side, toggleFavorite: this.toggleFavorite }} />

            : circlePreloader(this.state.SideMinHeight)
          }

          </div>
      </div>
    );
  }
}

TeaserTemplate.propTypes = {
  toggleTeaserSelection: PropTypes.func,
  decrementFavoritesCoun: PropTypes.func,
  incrementFavoritesCoun: PropTypes.func,
  openNotification: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  domain: PropTypes.string,
  popIndex: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  img: PropTypes.string,
  net: PropTypes.object,
  lnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  plnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default TeaserTemplate;
