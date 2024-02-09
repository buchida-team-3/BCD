// 삭제하면 안됨
import React, { useState } from 'react';
import './MainPage.css';
import LoginButton from './LoginButton';
import bgImage from './content/background.jpg'
import NavbarBefore from './NavbarBefore';

function MainPage() {
    
    return (
        <div className="container">
            <NavbarBefore />
            <img src={bgImage} alt="background" className="background-image" />
            <LoginButton />
        </div>
    );
}

export default MainPage;
