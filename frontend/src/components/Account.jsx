// Account.js
import React from 'react';
import './Account.css';

function Account({ label, link }) {
    return (
        <div className="account" onClick={() => link && (window.location.href = link)}>
            {label}
        </div>
    );
}

export default Account;
