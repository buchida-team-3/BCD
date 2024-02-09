import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginButton.css';

function LoginButton() {
    const navigate = useNavigate();
    return (
        <button className="main-login-button" onClick={() => navigate('/loginandsignup')}>
            Login
        </button>
    );
}

export default LoginButton;