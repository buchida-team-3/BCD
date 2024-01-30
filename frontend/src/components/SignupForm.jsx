import React from 'react';
import './SignupForm.css';

function SignupForm() {
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출을 방지합니다.

        // 입력 필드에서 데이터를 가져옵니다.
        const userid = document.getElementById('userid').value;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;
        const email = document.getElementById('email').value;

        // 서버에 전송할 데이터를 만듭니다.
        const data = {
            userid,
            password: password1,
            confirmPassword: password2,
            email
        };

        // fetch API를 사용하여 데이터를 서버에 전송합니다.
        fetch('http:/localhost:8000/signup/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                console.log('회원가입이 완료되었습니다.');
                
            } else {
                throw new Error('회원가입에 실패했습니다.');
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
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
