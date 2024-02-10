import React from 'react';
import './Navbar.css';
import logo from './content/logo.png';

function Navbar() {
    // 로그아웃 처리 함수
    const handleLogout = () => {
        // localStorage에서 항목 삭제
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_name');
        // 사용자를 /loginandsignup로 리다이렉션
        window.location.href = '/loginandsignup';
    }

    // 로고 클릭 처리 함수
    const handleLogoClick = () => {
        // 사용자를 /uploadpage로 리다이렉션
        window.location.href = '/uploadpage';
    }

    return (
        <div className="navbar">
            {/* 로고 클릭 시 handleLogoClick 함수 실행 */}
            <img src={logo} className="navbar-logo" alt="Logo" onClick={handleLogoClick} />
            <div className="navbar-menu">
                <div className="dropdown">
                    <button className="dropdown-button">Group</button>
                    <div className="dropdown-content">
                        <a href="/uploadpage">Group 1</a>
                        <a href="/uploadpage2">Group 2</a>
                    </div>
                </div>
                {/* 로그아웃 버튼에 onClick 이벤트 핸들러 추가 */}
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
