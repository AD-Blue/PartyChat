import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/nav.scss';

export default function Nav() {
    return (
        <nav>
            <ul>
                <li key='homeLink'>
                    <Link to='/'>Message Board</Link>
                </li>
                <li key='loginLink'>
                    <Link to='/login'>Log In</Link>
                </li>
                <li key='registerLink'>
                    <Link to='/register'>Register</Link>
                </li>
            </ul>
        </nav>
    )
}
