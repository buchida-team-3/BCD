import React from 'react';
import './MainPage.css';
import LoginButton from './LoginButton';
import bgImage from './content/background.jpg'

function MainPage() {
    return (
        <div className="container">
            <img src={bgImage} alt="background" className="background-image" />
            <LoginButton />
        </div>
    );
}

export default MainPage;
