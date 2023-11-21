import React, { useState } from 'react';
import CustomInputComponent from './CustomInputComponent';
import "./AuthorizationComponent.css";
import config from '../config';
// import { authAPI } from '../ApiCalls';

async function loginUser(credentials) {
    try {
        const response = await fetch(`${config.host}/auth/addNewUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
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