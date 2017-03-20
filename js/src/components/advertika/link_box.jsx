import React, { PropTypes } from 'react';

const LinkBox = (props) => (
  <div className={`link-box ${props.className}`}>
      {props.href
       ? (
        <a className="link-box_link" href={props.href || '#!'} target={props.target || '_blank'} >
          {props.title}
        </a>
       )
       : (
        <span className="link-box_link" onClick={props.onClick} >
          {props.title}
        </span>
       )
      }
      {' '}
      <a
        className="link-box_ico"
        href={props.extHref || '#!'}
        target={props.extTarget || '_blank'}
      />
  </div>
);

LinkBox.propTypes = {
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  title: PropTypes.string,
  onClick: PropTypes.func,
  target: PropTypes.string,
  extHref: PropTypes.string,
  className: PropTypes.string,
  extTarget: PropTypes.string,
};

export default LinkBox;
