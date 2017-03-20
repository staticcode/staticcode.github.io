import React from 'react';


const flatLinePreloader = () => (
  <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
    <div className="indeterminate"></div>
  </div>
);

export default flatLinePreloader;
