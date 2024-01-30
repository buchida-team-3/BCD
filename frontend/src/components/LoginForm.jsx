import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/login', 
                new URLSearchParams({
                    username: credentials.username,
                    password: credentials.password
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status === 200) {
                // 성공적으로 로그인 처리
                console.log('로그인 성공', response.data);
            } else {
                // 로그인 실패 처리
                console.error('로그인 실패', response.data);
            }
        } catch (error) {
            console.error('로그인 중 에러 발생:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="username"
                name="username"
                placeholder="아이디"
                className="login-input"
                value={credentials.username}
                onChange={handleInputChange}
            />
            <input
                type="password"
                id="password"
                name="password"
                placeholder="패스워드"
                className="login-input"
                value={credentials.password}
                onChange={handleInputChange}
            />
            <div className="button-link-container">
                <input type="submit" value="로그인" className="login-button" />
                <a href="/signup" className="signup-link">회원가입</a>
            </div>
        </form>
    );
}

export default LoginForm;
