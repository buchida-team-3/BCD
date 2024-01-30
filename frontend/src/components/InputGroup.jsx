// InputGroup.js
import React from 'react';
import './InputGroup.css';

function InputGroup() {
    return (
        <div>
            <input type="text" className="input-field" placeholder="새 그룹 명" />
            <div className="form-group">
                <input type="text" className="input-field" placeholder="아이디 추가 (복수 기입 가능)" />
            </div>
        </div>
    );
}

export default InputGroup;
