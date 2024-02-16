import React, { useState } from 'react';
import './Navbar.css';
import logo from './content/logo.png';
import bgImage from './content/background.jpg'

function Navbar() {
    const [isNavExpanded, setIsNavExpanded] = useState(false); // 네비게이션바 확장 상태 관리

    // 로그아웃 처리 함수
    const handleLogout = () => {
        // localStorage에서 항목 삭제
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_name');
        // 사용자를 /loginandsignup로 리다이렉션
        window.location.href = '/loginandsignup';
    }

    // // 로고 클릭 처리 함수
    // const handleLogoClick = () => {
    //     // 사용자를 /uploadpage로 리다이렉션
    //     window.location.href = '/uploadpage';
    // }

    // 햄버거 버튼 클릭 처리 함수
    const toggleNav = () => {
        setIsNavExpanded(!isNavExpanded); // 상태 토글
    }

    return (
        <div className="navbar">
            {/* 로고 클릭 시 handleLogoClick 함수 실행 */}
            <img src={bgImage} alt="background" className="background-image" />
            <img src={logo} className="navbar-logo" alt="Logo" onClick={toggleNav} />
            <div className={`navbar-menu ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
                <a className='link-button' href="/edit">Edit</a>
                <a className='link-button' href="/imagepage">View</a>
                <a className='link-button' href="/uploadpage">List</a>
                <a className='link-button' href="/book">Album</a>
                {/* <div className="dropdown">
                    <button className="dropdown-button">Group</button>
                    <div className="dropdown-content">
                        <a href="/uploadpage">Group 1</a>
                        <a href="/uploadpage2">Group 2</a>
                    </div>
                </div> */}
                {/* 로그아웃 버튼에 onClick 이벤트 핸들러 추가 */}
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
