import React from 'react';
import './LoginForm.css';

function LoginForm() {
    return (
        <form action="/login" method="post">
            <input type="text" id="username" name="username" placeholder="아이디" className="login-input" />
            <input type="password" id="password" name="password" placeholder="패스워드" className="login-input" />
            <div className="button-link-container">
                <input type="submit" value="로그인" className="login-button" />
                <a href="/signup" className="signup-link">회원가입</a>
            </div>
        </form>
    );
}

export default LoginForm;
