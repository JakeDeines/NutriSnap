// CellPhoneFrame.js
import React from 'react';
import './CellPhoneFrame.css';

const withCellPhoneFrame = WrappedComponent => props => {
  return (
    <div className="cell-phone-frame">
      <WrappedComponent {...props} />
    </div>
  );
};

export default withCellPhoneFrame;
