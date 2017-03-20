import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { circlePreloader } from './helpers';

export default class ModalContent extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    container: PropTypes.string,
    modal: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibility: false
    };
  }

  componentDidMount() {
    const { modal } = this.props;
    this._render();
  }

  componentWillUpdate() {
    this._render();
  }

  componentWillUnmount() {
    const { container } = this.props;
    ReactDOM.unmiuntComponentAtNode(document.querySelector(container));
  }

  _render() {
    const { children, container, modal } = this.props;
    const { visibility } = this.state;
    ReactDOM.render(
      children
       ? <div>{children}</div>
       : circlePreloader(100),
      document.querySelector(container)
    );
    const Modal = document.querySelector(modal);
    Modal.style.display = visibility ? 'block' : 'none';

  }

  render() {
    // if (this.state.visibility) {
    //   this.render();
    // }
    return <noscript />;
    }
  }
}
