// 삭제하면 안됨
import React from 'react';
import './Navbar.css';
import logo from './content/logo.png';

function Navbar() {
    return (
        <div className="navbar">
            <img src={logo} className="navbar-logo" alt="Logo" />
            <div className="navbar-menu">
                <div className="dropdown">
                    <button className="dropdown-button">Group</button>
                    <div className="dropdown-content">
                        <a href="/uploadpage">Group 1</a>
                        <a href="/uploadpage2">Group 2</a>
                    </div>
                </div>
                <button className="logout-button">Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
