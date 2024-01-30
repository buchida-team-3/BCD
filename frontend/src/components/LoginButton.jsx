import React from 'react';
import './MainLoginButton.css';

function LoginButton() {
    return (
        <button className="main-login-button" onClick={() => window.location.href = '/login'}>
            Login
        </button>
    );
}

export default LoginButton;