import React from 'react';
import CustomInputComponent from './CustomInputComponent';
import "./AuthorizationComponent.css";
import { Button } from '@mui/material';


const AuthorizationComponent = () => {
    // state = {
    //     email: "",
    //     password: ""
    // };

    // handleChange = e => {
    //     setState({ [e.currentTarget.id]: e.currentTarget.value });
    // };
    return (
        <div className='authorization'>
            <form className="form">
                <CustomInputComponent
                    labelText="Email"
                    id="email"
                    // handleChange={handleChange}
                    type="text"
                />
                <CustomInputComponent
                    labelText="Password"
                    id="password"
                    // handleChange={handleChange}
                    type="password"
                />
                <Button className='logInButton'>LOG IN</Button>
            </form>
        </div>
    );
}

export default AuthorizationComponent;