// CreateGroup.jsx

import React from 'react';
import Navbar from './Navbar'; // Navbar 컴포넌트 import
import EditButton from './EditButton'; // EditButton 컴포넌트 import
import InputGroup from './InputGroup';
import ButtonContainer from './ButtonContainer'; // ButtonContainer 컴포넌트 import
import './CreateGroup.css'; // CreateGroup 컴포넌트에서 사용할 CSS 파일 import

// CreateGroup 컴포넌트 정의
function CreateGroup() {
    return (
        <div>
            <Navbar />
            <div className='createGroup'>
                <EditButton />
                <InputGroup />
                <ButtonContainer />
            </div>
            
        </div>
    );
}

export default CreateGroup;
