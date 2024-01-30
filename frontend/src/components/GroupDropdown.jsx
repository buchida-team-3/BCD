import React from 'react';
import './GroupDropdown.css'; // GroupDropdown 컴포넌트의 CSS 파일을 import

const GroupDropdown = () => {
  return (
    <div className="dropdown">
      <button className="dropdown-button">Group</button>
      <div className="dropdown-content">
        <a href="#">Group 1</a>
        <a href="#">Group 2</a>
        <a href="#">Add Group</a>
      </div>
    </div>
  );
}

export default GroupDropdown;
