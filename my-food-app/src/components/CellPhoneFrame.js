// CellPhoneFrame.js
import React from 'react';
import './CellPhoneFrame.css';

const withCellPhoneFrame = WrappedComponent => props => {
  return (
    <div className="app-container">
    <div className="cell-phone-frame">
      <WrappedComponent {...props} />
    </div>
    </div>
  );
};

export default withCellPhoneFrame;
