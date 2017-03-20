import React, { PropTypes, Component } from 'react';
import ReactDom from 'react-dom';
import TraserSide from './tpl_side';
import Checkbox from '../CheckboxV2';
import cx from 'classnames';
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
    // this.toggleFavorite = this.toggleFavorite.bind(this);
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
    if (!this.props.disabled) {
      const $ = ReactDom.findDOMNode;
      const thisWidth = $(this).offsetWidth;
      const thisHeight = $(this).offsetHeight;
      const thisOffsetLeft = $(this).offsetLeft;
      const wrapperWidth = $(this).parentElement.offsetWidth;
      const thisSideWidth = 290;

      const openRight = (wrapperWidth - (thisWidth + thisOffsetLeft + thisSideWidth)) < 0;

      document.addEventListener('click', this._outsideClick);
      this.setState({
        active: !this.state.active,
        openRight,
        SideMinHeight: thisHeight,
      });
    }
  }

  handleMouseDown() {
    if (!this.state.side && !this.props.disabled) {
      window.$.post('/mytarget/mobile/info', { id: this.props.id }, result => {
        this.setState({ side: result });
      }, 'json');
    }
  }

  // toggleFavorite(action) {
  //   const { id, openNotification, decrementFavoritesCoun, incrementFavoritesCoun } = this.props;
  //   window.$.post(`/teazer/list/fav${action ? 'del' : 'add'}`, { ids: [id] }, result => {
  //     if (result.success === false && typeof result.msg !== 'undefined') {
  //       return openNotification({
  //         message: result.msg,
  //         level: 'warning',
  //         position: 'tc',
  //         autoDismiss: 5,
  //       });
  //     }
  //     const message = action ? 'удалено из избранного' : 'добавлено в избранное';
  //     openNotification({
  //       message: `Объявление ${message}. <a href="/teazer/favorites/index">Перейти в избранное</a>`,
  //       level: action ? 'warning' : 'success',
  //       position: 'tc',
  //       autoDismiss: 5,
  //     });
  //     this.setState({
  //       side: { ...this.state.side, is_fav: !action },
  //     });
  //     (action ? decrementFavoritesCoun : incrementFavoritesCoun)(1);

  //   }, 'json')
  //   .fail(() => openNotification({
  //     message: 'Неудалось добавить объявления!',
  //     level: 'error',
  //     position: 'tc',
  //     autoDismiss: 5,
  //   }));
  // }

  render() {
    const {
      title,
      description,
      selected,
      domain,
      id,
      ico,
      img,
      tmb,
      view,
      type,
      popIndex,
      netName,
      toggleTeaserSelection,
      checkboxHidden,
      disabled,
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
      <div className={cx('m-mttpl', activeClasses, { __disabled: disabled })} >
          <div className="m-mttpl_cnt">
              <div className="m-mttpl_cnt-t" onMouseDown={this.handleMouseDown} onClick={this.handleClick} data-tip="">
                  <div className="ovh">
                    {tmb && <img src={tmb} className="m-mttpl_tmb" />}
                    <div className="ovh">
                      <div className="m-mttpl_title"> {title} </div>
                      <div className="m-mttpl_domen"><span className={ico} /> {domain} </div>
                    </div>

                  </div>

                  {type === 1 && <div className="m-mttpl_img" style={{ width: '100px', float: 'left', margin: '0 10px 5px 0' }}> <img src={img} /> </div>}
                  <div className="m-mttpl_descript">{description}</div>
                  {type === 2 && <div className="m-mttpl_img"> <img src={img} /> </div>}
              </div>
              <div className="m-mttpl_cnt-b">
                <Checkbox id={id} checked={selected} onChange={(e) => toggleTeaserSelection(id, e)} hidden={checkboxHidden}>
                  <div className="right">{netName}</div>
                  <div className="ion-eye" >
                    <span>
                      {view}
                    </span>
                  </div>
                </Checkbox>
              </div>
          </div>
          <div
            className="m-mttpl_side"
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
  disabled: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  domain: PropTypes.string,
  popIndex: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  img: PropTypes.string,
  netName: PropTypes.string,
  lnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  plnd: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default TeaserTemplate;
