import React, { useState } from 'react';
import './MainPage.css';
import MainButton from './MainButton';
import bgImage from './content/background.jpg'
import NavbarBefore from './NavbarBefore';

function MainPage() {
    
    return (
        <div className="container">
            <NavbarBefore />
            <img src={bgImage} alt="background" className="background-image" />
            <MainButton />
        </div>
    );
}

export default MainPage;
