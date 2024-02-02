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
                        <a href="#">Group 1</a>
                        <a href="#">Group 2</a>
                        <a href="#">Add Group</a>
                    </div>
                </div>
                <button className="logout-button">Login</button>
            </div>
        </div>
    );
}

export default Navbar;
