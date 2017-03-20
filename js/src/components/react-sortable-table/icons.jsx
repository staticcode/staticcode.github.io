import React, { PropTypes } from 'react';


export const SortIconBoth = ({ style }) => (
  <FaIcon icon="" style={style} />
);

SortIconBoth.propTypes = {
  style: PropTypes.object,
};


export const SortIconAsc = ({ style }) => (
  <FaIcon icon="ion-arrow-up-b" style={style} />
);

SortIconAsc.propTypes = {
  style: PropTypes.object,
};


export const SortIconDesc = ({ style }) => (
  <FaIcon icon="ion-arrow-down-b" style={style} />
);

SortIconDesc.propTypes = {
  style: PropTypes.object,
};


export const FaIcon = ({ style, icon }) => (
  <i className={icon} style={{ style }} />
);

FaIcon.propTypes = {
  style: PropTypes.object,
  icon: PropTypes.string,
};

