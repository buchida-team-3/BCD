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

                // 로그인 성공시 토큰과 유저이름을 localStorage에 저장
                // 토큰이 만료되면 토큰과 유저이름 모두 삭제 필요
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('user_name', response.data.user_name);
                window.location.href = 'album';

            } else {
                // 로그인 실패 처리
                console.error('로그인 실패', response.data);
            }
        } catch (error) {
            console.error('로그인 중 에러 발생:', error);
        }
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
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
                placeholder="비밀번호"
                className="login-input"
                value={credentials.password}
                onChange={handleInputChange}
            />
            <div className="button-link-container">
                <input type="submit" value="로그인" className="login-confirm-button" />
            </div>
        </form>
    );
}

export default LoginForm;
