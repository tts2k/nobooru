import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Login.scss';

async function loginUser(credentials) {
    const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    const data = await res.json();
    return data.token;
}

export default function Login({ setToken }) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const token = await loginUser({
                username,
                password
            })

            setToken(token);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className="login-wrapper">
            <h1> Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}
