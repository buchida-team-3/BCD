import React from 'react';
import './LoginContainer.css';
import LoginForm from './LoginForm';

function LoginContainer() {
    return (
        <div className="login-container">
            <div className={'logo'}> 붙이다.</div>
            <LoginForm/>
        </div>
    );
}

export default LoginContainer;
