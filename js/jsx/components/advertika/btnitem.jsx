import React from 'react';

class Btnitem extends React.Component {
  render() {
    return (
      <button
        { ...this.props }
        className={`button ${this.props.className}`}
      >
        { this.props.children }
      </button>
    );
  }
}

export default Btnitem;
