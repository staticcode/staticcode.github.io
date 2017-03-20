// https://github.com/hbm/md-components/blob/master/components/modal/index.js

import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Modal component
 */
const Modal = ({ header, body, footer, visibility, toggle, size }) => (
  <div
    className={cx('r-modal', { 'is-visible': visibility })}
    onClick={() => toggle(false)}
    onTouchEnd={() => toggle(false)}
  >
    <div
      className={cx('r-modal_content', { 'is-visible': visibility, [size]: size })}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {!!header &&
      <div className="r-modal_header">
        {header}
        <button className="close-button" onClick={() => toggle(false)}>
          <i className="ion-close-round" />
        </button>
      </div>}
      {!!body &&
      <div className="r-modal_body">
        {body}
      </div>}
      {!!footer &&
      <div className="r-modal_footer">
        {footer}
      </div>}
    </div>
  </div>
);

Modal.propTypes = {
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
  body: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
  footer: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
  visibility: PropTypes.bool,
  toggle: PropTypes.func,
  size: PropTypes.string,
};

Modal.defaultProps = {
  visibility: false,
  toggle: () => {},
};

export default Modal;
