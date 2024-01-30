// Container.js
import React from 'react';
import Account from './Account';
import './Container.css';

function Container() {
    return (
        <div className="container">
            <div className="title">
                <h1>Choose Your Group</h1>
            </div>
            <div className="accounts">
                <Account label="SCV" link="uploadBefore.html" />
                <Account label="bucida." />
                <Account label="+" link="createGroup.html" />
            </div>
        </div>
    );
}

export default Container;
