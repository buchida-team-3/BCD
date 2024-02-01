import React, { useState } from 'react';
import './MainPage.css';
import LoginButton from './LoginButton';
import bgImage from './content/background.jpg'
import Navbar from './Navbar';

function MainPage() {
    
    return (
        <div className="container">
            <Navbar />
            <img src={bgImage} alt="background" className="background-image" />
            <LoginButton />
        </div>
    );
}

export default MainPage;
