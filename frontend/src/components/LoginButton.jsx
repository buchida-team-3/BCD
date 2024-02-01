import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainLoginButton.css';

function LoginButton() {
    const navigate = useNavigate();
    return (
        <button className="main-login-button" onClick={() => navigate('/loginandsignup')}>
            Login
        </button>
    );
}

export default LoginButton;