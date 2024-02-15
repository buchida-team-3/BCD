import React from 'react';
import './Page.css';

const Page = React.forwardRef(({ number, text }, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <h2 className="page-header">Page header - {number}</h2>
        <div className="page-image"></div>
        <div className="page-text">{text}</div>
        <div className="page-footer">{number}</div>
      </div>
    </div>
  );
});

export default Page;