import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainButton.css';

function MainButton() {
    const navigate = useNavigate();
    return (
        <button className="main-login-button" onClick={() => navigate('/loginandsignup')}>
            로그인
        </button>
    );
}

export default MainButton;