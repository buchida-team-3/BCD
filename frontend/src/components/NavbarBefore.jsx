import React from 'react';
import './Navbar.css';
import logo from './content/logo.png';

function NavbarBefore() {
    return (
        <div className="navbar">
            <img src={logo} className="navbar-logo" alt="Logo" />
        </div>
    );
}

export default NavbarBefore;
