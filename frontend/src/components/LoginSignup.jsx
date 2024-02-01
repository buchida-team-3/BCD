import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';
import bgImage from './content/background.jpg'
import './LoginSignup.css';

function LoginSignup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []); // 컴포넌트가 마운트되면 페이드 인

  return (
    <div className='login-signup-container'>
      <Navbar />
      <img src={bgImage} alt="background" className="background-image" />
      <div className={`login-signup ${isVisible ? 'show' : ''}`}>
        <LoginContainer />
        <SignupContainer />
      </div>
    </div>
  );
}

export default LoginSignup;
