import React, { useState } from 'react';
import CustomInputComponent from './CustomInputComponent';
import "./AuthorizationComponent.css";


async function loginUser(credentials) {
    return fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}


const AuthorizationComponent = ({ setToken }) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token);
    }

    return (
        <div className='authorization'>
            <form className="form" onSubmit={handleSubmit}>
                <CustomInputComponent
                    labelText="Login"
                    id="login"
                    handleChange={e => setUserName(e.target.value)}
                    type="text"
                />
                <CustomInputComponent
                    labelText="Password"
                    id="password"
                    handleChange={e => setPassword(e.target.value)}
                    type="password"
                />
                {/* <Button className='logInButton'>LOG IN</Button> */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}


export default AuthorizationComponent;