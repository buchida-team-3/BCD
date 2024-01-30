import React from 'react';
import './FormGroup.css';

function FormGroup() {
    return (
        <div className="form-group">
            <input type="text" className="input-field" placeholder="아이디 추가 (복수 기입 가능)" />
        </div>
    );
}

export default FormGroup;
