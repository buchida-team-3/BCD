import React from 'react';
import './SignupForm.css';

function SignupForm() {
    return (
        <form action="http:/localhost:8000/signup/submit" method="post">
            <input type="text" id="userid" name="userid" placeholder="아이디" className="signup-input"/>
            <input type="password" id="password1" name="password1" placeholder="비밀번호" className="signup-input"/>
            <input type="password" id="password2" name="password2" placeholder="비밀번호 확인" className="signup-input"/>
            <input type="email" id="email" name="email" placeholder="이메일" className="signup-input"/>
            <div className="button-container">
                <input type="submit" value="확인" className="button confirm-button"/>
                <button type="button" className="button" onClick={() => window.location.href='/login'}>뒤로</button>
            </div>
        </form>
    );
}

export default SignupForm;
