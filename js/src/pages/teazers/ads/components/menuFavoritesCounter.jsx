import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as toolbarActions from '../actions/toolbarActions';

export class MenuFavoritesCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>{this.props.favorites}</div>
    );
  }
}

MenuFavoritesCounter.propTypes = {
  favorites: React.PropTypes.number,
};


function mapStateToProps({ favorites }) {
  return {
    favorites,
  };
}

export default connect(mapStateToProps, toolbarActions)(MenuFavoritesCounter);
