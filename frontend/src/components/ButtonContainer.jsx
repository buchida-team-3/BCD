// ButtonContainer.js
import React from 'react';
import './ButtonContainer.css';

function ButtonContainer() {
    return (
        <div className="button-container">
            <button className="invite-button">초대</button>
            <button className="back-button" onClick={() => window.location.href='selectGroup.html'}>뒤로</button>
        </div>
    );
}

export default ButtonContainer;
