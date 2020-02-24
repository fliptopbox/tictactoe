import * as React from 'react';
import './logo.scss';

export default logo;

function logo(string = null) {
    const subheading = string ? (
        <h2 className="logo-subheading">{string}</h2>
    ) : null;

    const description = (
        <h2 className="logo-description">
            it's tic-tac-toe with a tactic twist
        </h2>
    );

    return (
        <div className="logo">
            <h1 className="logo-brand">tactictoe</h1>
            <div className="logo-footer">
                {description}
                {subheading}
            </div>
        </div>
    );
}
